package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.goong.Location;
import com.ntt.elogistics.dtos.CreateParcelRequest;
import com.ntt.elogistics.enums.ParcelStatus;
import com.ntt.elogistics.exceptions.CustomException;
import com.ntt.elogistics.exceptions.NotFoundParcel;
import com.ntt.elogistics.exceptions.NotFoundUsernameException;
import com.ntt.elogistics.models.Parcel;
import com.ntt.elogistics.models.Product;
import com.ntt.elogistics.models.ProductParcel;
import com.ntt.elogistics.models.User;
import com.ntt.elogistics.repositories.ParcelRepository;
import com.ntt.elogistics.repositories.ProductParcelRepository;
import com.ntt.elogistics.repositories.ProductRepository;
import com.ntt.elogistics.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class ParcelService {
    private final ParcelRepository parcelRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductParcelRepository productParcelRepository;

    private final TrackingService trackingService;
    private final GoongService goongService;
    private final ShippingFeeService shippingFeeService;
    private final AssignmentBranchService assignmentBranchService;
    private final MailService mailService;
    private final ProductParcelService productParcelService;


    public Parcel customerCreateParcel(CreateParcelRequest request, Authentication authentication) {
        // to model
        Parcel parcel = CreateParcelRequest.toModel(request);

        // set customer create
        parcel.setUserId(getUserIdToStringFromAuthentication(authentication));

        // set shipping fee
        parcel.setWeightChargeable(shippingFeeService.getChargeableWeight(parcel));
        parcel.setShippingFee(shippingFeeService.getShippingFee(parcel.getFromProvince(), parcel.getToProvince(), parcel.getWeightChargeable()));

        // set status parcel
        parcel.setStatus(ParcelStatus.CREATED);

        // set assignment branch
        String fromBranchId = assignmentBranchService.getFromBranchIdAutoAssignment(parcel);
        String toBranchId = assignmentBranchService.getToBranchIdAutoAssignment(parcel);

        parcel.setToBranchId(toBranchId);
        parcel.setFromBranchId(fromBranchId);

        // set location
        String fromAddress = String.format("%s, %s, %s, %s",
                parcel.getFromStreet(),
                parcel.getFromWard(),
                parcel.getFromDistrict(),
                parcel.getFromProvince());
        Location fromLocation = goongService.getLocationFromAddress(fromAddress);
        parcel.setFromLat(fromLocation.getLat());
        parcel.setFromLng(fromLocation.getLng());

        String toAddress = String.format("%s, %s, %s, %s",
                parcel.getToStreet(),
                parcel.getToWard(),
                parcel.getToDistrict(),
                parcel.getToProvince());
        Location toLocation = goongService.getLocationFromAddress(toAddress);
        parcel.setToLat(toLocation.getLat());
        parcel.setToLng(toLocation.getLng());

        // save db
        Parcel saved = parcelRepository.save(parcel);

        String savedId = saved.getId().toString();

        // tracking
        trackingService.createTracking(savedId, ParcelStatus.CREATED);
        productParcelService.createProductParcel(savedId, request.getProducts(), authentication);
        User u = userRepository.findByUsername(authentication.getName()).orElseThrow(NotFoundUsernameException::new);
        mailService.sendSimpleMail(u.getEmail(),
                "Tạo đơn hàng thành công",
                """
                        Xin chào %s,
                        
                        Đơn hàng của bạn đã được tạo thành công.
                        Mã tracking: %s
                        
                        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                        """.formatted(u.getFullName(), saved.getId())
        );

        return saved;
    }

    public String getUserIdToStringFromAuthentication(Authentication authentication) {
        return userRepository.findIdByUsername(authentication.getName())
                .orElseThrow(NotFoundUsernameException::new)
                .toString();
    }

    public String getRoleFromAuthentication(Authentication authentication) {
        return authentication.getAuthorities().iterator().next().getAuthority();
    }

    public String getBranchWorkFromAuthentication(Authentication authentication) {
        return userRepository.findBranchWorkIdByUsername(authentication.getName());
    }

    public Page<Parcel> getParcelPage(int page, int size, ParcelStatus status, String search, Authentication authentication) {
        String userId = getUserIdToStringFromAuthentication(authentication);
        String role = getRoleFromAuthentication(authentication);
        String branchId = "";
        Pageable pageable = PageRequest.of(page, size, Sort.by("updateAt").descending());
        if(role.equals("ROLE_MANAGER")){
            branchId = getBranchWorkFromAuthentication(authentication);
        }

        return parcelRepository.findAllCustom(userId, branchId, search, status, pageable);
    }

    private Parcel getParcelById(UUID id) {
        return parcelRepository.findById(id).orElseThrow(() -> new NotFoundParcel(id.toString()));
    }

    public Parcel getParcelById(UUID id, Authentication authentication) {
        Parcel parcel = getParcelById(id);
        String customerId = getUserIdToStringFromAuthentication(authentication);
        // check customer or shipper
        if (parcel.getUserId().equals(customerId) ||
                (parcel.getDeliveryShipperId() != null  && parcel.getDeliveryShipperId().equals(customerId)) ||
                (parcel.getPickupShipperId() != null && parcel.getPickupShipperId().equals(customerId))) {
            return parcel;
        }
        String branchId = getBranchWorkFromAuthentication(authentication);
        // check manager
        if ( (parcel.getFromBranchId() != null && parcel.getFromBranchId().equals(branchId)) ||
                (parcel.getToBranchId() != null  && parcel.getToBranchId().equals(branchId))) {
            return parcel;
        }
        // check admin
        if(getRoleFromAuthentication(authentication).equals("ADMIN")){
            return parcel;
        }
        throw new CustomException("Không có quyền truy cập tài nguyên này", HttpStatus.FORBIDDEN);
    }

    public Parcel updateParcelById(UUID id,
                                   ParcelStatus status,
                                   String shipperId,
                                   String typeShipper,
                                   Authentication authentication){
        Parcel parcel = getParcelById(id);

        if(status != null){
            parcel.setStatus(status);
        }

        // khi gán shipper sẽ tự động set trạng thái
        if(typeShipper!=null && shipperId != null){
            if(typeShipper.equals("pickup")){
                parcel.setPickupShipperId(shipperId);
                parcel.setStatus(ParcelStatus.PICKUP_IN_PROGRESS);
            }else if (typeShipper.equals("delivery")){
                parcel.setDeliveryShipperId(shipperId);
                parcel.setStatus(ParcelStatus.DELIVERY_IN_PROGRESS);
            }
        }

        Parcel saved = parcelRepository.save(parcel);

        // khi gán shipper sẽ tự động set trạng thái
        if(typeShipper!=null && shipperId != null){
            if(typeShipper.equals("pickup")){
                trackingService.createTracking(saved.getId().toString(),ParcelStatus.PICKUP_IN_PROGRESS);
            }else if (typeShipper.equals("delivery")){
                trackingService.createTracking(saved.getId().toString(),ParcelStatus.DELIVERY_IN_PROGRESS);
            }
        }

        if(status != null){
            trackingService.createTracking(saved.getId().toString(),status);
            if (status == ParcelStatus.RETURNED) {
                List<ProductParcel> productParcels = productParcelRepository.findByParcelId(saved.getId().toString());
                for (ProductParcel pp : productParcels) {
                    Product product = productRepository.findById(UUID.fromString(pp.getProductId()))
                            .orElseThrow(() -> new RuntimeException("Product not found"));

                    product.setQuantity(product.getQuantity() + pp.getQuantity());
                    productRepository.save(product);
                }
            }
        }
        return saved;
    }



}


