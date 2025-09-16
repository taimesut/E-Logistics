package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.ProductInParcelCreateRequest;
import com.ntt.elogistics.exceptions.CustomException;
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
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ProductParcelService {
    private final ProductParcelRepository productParcelRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ParcelRepository parcelRepository;

    public void createProductParcel(String parcelId, List<ProductInParcelCreateRequest> products, Authentication authentication){
        User u = userRepository.findByUsername(authentication.getName()).orElseThrow(NotFoundUsernameException::new);
        List<ProductParcel> list = products.stream().map(p->{
            Product product = productRepository.findById(UUID.fromString((p.getProductId()))).orElseThrow(()->new CustomException("Không tìm thấy sản phẩm", HttpStatus.BAD_REQUEST));
            if(product.getQuantity()<p.getQuantity()){
                throw new CustomException("Số lượng không hợp lệ",HttpStatus.BAD_REQUEST);
            }
            product.setQuantity(product.getQuantity()-p.getQuantity());
            return ProductParcel.builder()
                    .parcelId(parcelId)
                    .productId(p.getProductId())
                    .quantity(p.getQuantity())
                    .price(p.getPrice())
                    .build();
        }).toList();
        productParcelRepository.saveAll(list);
    }

    public List<Product> getProductsByParcelId(String parcelId, Authentication authentication) {
//        User u = userRepository.findByUsername(authentication.getName()).orElseThrow(NotFoundUsernameException::new);
        Parcel parcel = parcelRepository.findById(UUID.fromString((parcelId))).orElseThrow(()->new CustomException("Không tìm thấy đơn hàng",HttpStatus.BAD_REQUEST));
//        if(!parcel.getUserId().equals(u.getId().toString())){
//            throw  new CustomException("Yêu cầu không hợp lệ",HttpStatus.BAD_REQUEST);
//        }
        List<ProductParcel> productParcels = productParcelRepository.findByParcelId(parcelId);
        return productParcels.stream()
                .map(pp -> {
                    Product product = productRepository.findById(UUID.fromString(pp.getProductId())).orElse(null);
                    if (product != null) {
                        product.setQuantity(pp.getQuantity());
                        return product;
                    }
                    return null;
                })
                .filter(p -> p != null)
                .collect(Collectors.toList());
    }
}
