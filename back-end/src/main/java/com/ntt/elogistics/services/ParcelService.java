package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.goong.Location;
import com.ntt.elogistics.dtos.requests.CreateParcelRequest;
import com.ntt.elogistics.enums.ParcelStatus;
import com.ntt.elogistics.exceptions.CustomException;
import com.ntt.elogistics.exceptions.NotFoundParcel;
import com.ntt.elogistics.exceptions.NotFoundUsernameException;
import com.ntt.elogistics.models.Parcel;
import com.ntt.elogistics.models.User;
import com.ntt.elogistics.repositories.ParcelRepository;
import com.ntt.elogistics.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class ParcelService {
    private final ParcelRepository parcelRepository;
    private final UserRepository userRepository;

    private final TrackingService trackingService;
    private final GoongService goongService;
    private final ShippingFeeService shippingFeeService;
    private final AssignmentBranchService assignmentBranchService;
    private final MailService mailService;


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
        String toBranchId = assignmentBranchService.getFromBranchIdAutoAssignment(parcel);
        String fromBranchId = assignmentBranchService.getToBranchIdAutoAssignment(parcel);

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
        User u = userRepository.findByUsername(authentication.getName()).orElseThrow(NotFoundUsernameException::new);
        mailService.sendSimpleMail(u.getEmail(), "Tạo đơn hàng thành công", "Mã tracking: " + saved.getId().toString());

        return saved;
    }

    public Parcel customerGetParcelById(Long id, Authentication authentication) {
        Parcel parcel = getParcelById(id);
        if (parcel.getUserId().equals(getUserIdToStringFromAuthentication(authentication))) {
            return parcel;
        }
        throw new CustomException("Id không phù hợp", HttpStatus.BAD_REQUEST);
    }

    public Parcel customerCancelParcelById(Long id, Authentication authentication) {
        Parcel parcel = getParcelById(id);
        if (parcel.getUserId().equals(getUserIdToStringFromAuthentication(authentication))) {
            parcel.setStatus(ParcelStatus.CANCELLED);
            trackingService.createTracking(parcel.getId().toString(), ParcelStatus.CANCELLED);
            return parcelRepository.save(parcel);
        }
        throw new CustomException("Id không phù hợp", HttpStatus.BAD_REQUEST);
    }

    public Page<Parcel> customerGetParcelsPage(int page, int size, ParcelStatus status, String search, Authentication authentication) {
        String customerId = getUserIdToStringFromAuthentication(authentication);
        if (status != null) {
            return parcelRepository.findByUserIdAndStatus(customerId, status, search, PageRequest.of(page, size));
        }
        return parcelRepository.findByUserId(customerId, search, PageRequest.of(page, size));
    }


    public String getUserIdToStringFromAuthentication(Authentication authentication) {
        return userRepository.findIdByUsername(authentication.getName())
                .orElseThrow(NotFoundUsernameException::new)
                .toString();
    }

    public Parcel getParcelById(Long id) {
        return parcelRepository.findById(id).orElseThrow(() -> new NotFoundParcel(id.toString()));
    }


    public Page<Parcel> shipperGetParcelsPage(int page, int size, String type, ParcelStatus status, String search, Authentication authentication) {
        String shipperId = getUserIdToStringFromAuthentication(authentication);
        if ("pickup".equalsIgnoreCase(type)) {
            if (status != null) {
                return parcelRepository.findByPickupShipperIdAndStatus(shipperId, status, search, PageRequest.of(page, size));
            }
            return parcelRepository.findByPickupShipperId(shipperId, search, PageRequest.of(page, size));
        } else if ("delivery".equalsIgnoreCase(type)) {
            if (status != null) {
                return parcelRepository.findByDeliveryShipperIdAndStatus(shipperId, status, search, PageRequest.of(page, size));
            }
            return parcelRepository.findByDeliveryShipperId(shipperId, search, PageRequest.of(page, size));
        }
        return Page.empty();
    }

    public Parcel shipperGetParcelById(Long id, Authentication authentication) {
        Parcel parcel = getParcelById(id);
        String userId = getUserIdToStringFromAuthentication(authentication);
        if (Objects.equals(userId, parcel.getDeliveryShipperId())
                || Objects.equals(userId, parcel.getPickupShipperId())) {
            return parcel;
        }
        throw new CustomException("Yêu cầu không phù hợp shipperGetParcelById", HttpStatus.BAD_REQUEST);
    }

    public Parcel shipperUpdateStatusParcel(Long id, ParcelStatus status, Authentication authentication) {
        Parcel parcel = getParcelById(id);
        String userId = getUserIdToStringFromAuthentication(authentication);
        User u = userRepository.findByUsername(authentication.getName()).orElseThrow(NotFoundUsernameException::new);
        if (Objects.equals(userId, parcel.getDeliveryShipperId())
                || Objects.equals(userId, parcel.getPickupShipperId())) {
            parcel.setStatus(status);
            Parcel saved = parcelRepository.save(parcel);
            trackingService.createTracking(saved.getId().toString(), status);
            if(status==ParcelStatus.DELIVERED){
                mailService.sendSimpleMail(u.getEmail(), "Đơn hàng đã được giao", "Đơn hàng có mã tracking: " + saved.getId().toString() + " đã được giao cho người nhận");

            }
            return saved;
        }
        throw new CustomException("Yêu cầu không phù hợp shipperUpdateStatusParcel", HttpStatus.BAD_REQUEST);
    }


    public Page<Parcel> managerGetParcelsPage(int page, int size, String type, ParcelStatus status, String search, Authentication authentication) {
        String branchId = userRepository.findBranchWorkIdByUsername(authentication.getName());
        if ("pickup".equalsIgnoreCase(type)) {
            if (status != null) {
                return parcelRepository.findByFromBranchIdAndStatus(branchId, status, search, PageRequest.of(page, size));
            }
            return parcelRepository.findByFromBranchId(branchId, search, PageRequest.of(page, size));
        } else if ("delivery".equalsIgnoreCase(type)) {
            if (status != null) {
                return parcelRepository.findByToBranchIdAndStatus(branchId, status, search, PageRequest.of(page, size));
            }
            return parcelRepository.findByToBranchId(branchId, search, PageRequest.of(page, size));
        }
        return Page.empty();
    }

    public Parcel managerGetParcelById(Long id, Authentication authentication) {
        Parcel parcel = getParcelById(id);
        String branchId = userRepository.findBranchWorkIdByUsername(authentication.getName());
        if (Objects.equals(branchId, parcel.getFromBranchId())
                || Objects.equals(branchId, parcel.getToBranchId())) {
            return parcel;
        }
        throw new CustomException("Yêu cầu không phù hợp managerGetParcelById", HttpStatus.BAD_REQUEST);
    }

    public Parcel managerSetShipper(Long id, int shipperId, String type) {
        Parcel parcel = getParcelById(id);
        if ("delivery".equalsIgnoreCase(type)) {
            parcel.setDeliveryShipperId(String.valueOf(shipperId));
            parcel.setStatus(ParcelStatus.DELIVERY_IN_PROGRESS);
            trackingService.createTracking(String.valueOf(parcel.getId()), ParcelStatus.DELIVERY_IN_PROGRESS);
        } else if ("pickup".equalsIgnoreCase(type)) {
            parcel.setPickupShipperId(String.valueOf(shipperId));
            parcel.setStatus(ParcelStatus.PICKUP_IN_PROGRESS);
            trackingService.createTracking(String.valueOf(parcel.getId()), ParcelStatus.PICKUP_IN_PROGRESS);

        } else {
            throw new CustomException("Yêu cầu không phù hợp managerSetShipper", HttpStatus.BAD_REQUEST);
        }
        return parcelRepository.save(parcel);
    }

    public Parcel managerSetStatusParcel(Long id, ParcelStatus status, Authentication authentication) {
        Parcel parcel = getParcelById(id);
        parcel.setStatus(status);
        Parcel saved = parcelRepository.save(parcel);
        trackingService.createTracking(String.valueOf(parcel.getId()), status);
        return saved;
    }

    public Map<String, Long> countByStatusFromOrToBranch(Authentication authentication) {
        String branchId = userRepository.findBranchWorkIdByUsername(authentication.getName());
        List<Object[]> results = parcelRepository.countByStatusFromOrToBranch(branchId);
        Map<String, Long> stats = results.stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> (Long) row[1]
                ));

        for (ParcelStatus status : ParcelStatus.values()) {
            stats.putIfAbsent(status.name(), 0L);
        }

        return stats;
    }

    public Map<String, Long> countByStatusPickupOrDeliveryShipperId(Authentication authentication) {
        String branchId = getUserIdToStringFromAuthentication(authentication);
        List<Object[]> results = parcelRepository.countByStatusPickupOrDeliveryShipperId(branchId);
        Map<String, Long> stats = results.stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> (Long) row[1]
                ));

        for (ParcelStatus status : ParcelStatus.values()) {
            stats.putIfAbsent(status.name(), 0L);
        }

        return stats;
    }

    public long customerCountParcel(Authentication authentication) {
        String userId = getUserIdToStringFromAuthentication(authentication);
        return parcelRepository.countByUserId(userId);
    }

    public long customerCountParcelByStatus(Authentication authentication, ParcelStatus status) {
        String userId = getUserIdToStringFromAuthentication(authentication);
        return parcelRepository.countParcelsByUserIdAndStatus(userId, status);
    }

}


