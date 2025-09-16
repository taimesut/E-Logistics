//package com.ntt.elogistics.controllers;
//
//import com.ntt.elogistics.enums.ParcelStatus;
//import com.ntt.elogistics.helpers.ApiResponseFactory;
//import com.ntt.elogistics.models.Parcel;
//import com.ntt.elogistics.models.Product;
//import com.ntt.elogistics.services.ParcelService;
//import com.ntt.elogistics.dtos.CreateParcelRequest;
//import com.ntt.elogistics.services.ProductParcelService;
//import com.ntt.elogistics.services.ProductService;
//import com.ntt.elogistics.services.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/customer")
//@PreAuthorize("hasRole('CUSTOMER')")
//public class CustomerController {
//    private final ParcelService parcelService;
//    private final UserService userService;
//    private final ProductService productService;
//    private final ProductParcelService productParcelService;
//
//    @PostMapping("/parcel")
//    public ResponseEntity<?> createParcel(@RequestBody CreateParcelRequest request, Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(ApiResponseFactory.created("createParcel", parcelService.customerCreateParcel(request, authentication)));
//    }
//
//    @GetMapping("/parcel")
//    public ResponseEntity<?> getParcels(Authentication authentication,
//                                        @RequestParam(defaultValue = "0") int page,
//                                        @RequestParam(defaultValue = "10") int size,
//                                        @RequestParam(required = false) ParcelStatus status,
//                                        @RequestParam(defaultValue = "") String search) {
//        Page<Parcel> parcelPage = parcelService.customerGetParcelsPage(page, size, status,search, authentication);
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("data", parcelPage.getContent());
//        response.put("currentPage", parcelPage.getNumber());
//        response.put("totalItems", parcelPage.getTotalElements());
//        response.put("totalPages", parcelPage.getTotalPages());
//
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("getParcels", response));
//    }
//
//    @GetMapping("/parcel/{id}")
//    public ResponseEntity<?> getParcel(@PathVariable Long id, Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("getParcel", parcelService.customerGetParcelById(id, authentication)));
//    }
//
//    @GetMapping("/shipper/{id}")
//    public ResponseEntity<?> getShipper(@PathVariable Long id, Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("getShippers", userService.customerGetShipper(id, authentication)));
//    }
//
//    @PutMapping("/parcel/{id}")
//    public ResponseEntity<?> cancelParcel(@PathVariable Long id, Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("cancelParcel", parcelService.customerCancelParcelById(id, authentication)));
//    }
//
//    @GetMapping("/stats")
//    public ResponseEntity<?> getStats(Authentication authentication) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("SUM", parcelService.customerCountParcel(authentication));
//        for (ParcelStatus status : ParcelStatus.values()) {
//            long count = parcelService.customerCountParcelByStatus(authentication, status);
//            response.put(status.name(), count);
//        }
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("getStats", response));
//    }
//
//    @GetMapping("/product")
//    public ResponseEntity<?> getProducts(Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("getProducts", productService.getProducts(authentication)));
//    }
//    @GetMapping("/product/{id}")
//    public ResponseEntity<?> getProduct(@PathVariable Long id, Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("getProducts", productService.getProduct(id,authentication)));
//    }
//    @DeleteMapping("/product/{id}")
//    public ResponseEntity<?> deleteProduct(@PathVariable Long id, Authentication authentication) {
//        productService.delete(id,authentication);
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(ApiResponseFactory.created("createProduct", null));
//    }
//    @PutMapping(value = "/product/{id}", consumes = {"multipart/form-data"})
//    public ResponseEntity<?> updateProduct(@PathVariable Long id,@RequestPart("product") Product product, @RequestPart(required = false, name = "file") MultipartFile file, Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(ApiResponseFactory.created("updateProduct", productService.updateProduct(id,product,file,authentication)));
//    }
//    @PostMapping(value = "/product", consumes = {"multipart/form-data"})
//    public ResponseEntity<?> createProduct(@RequestPart("product") Product product, @RequestPart("file") MultipartFile file, Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(ApiResponseFactory.created("createProduct", productService.createProduct(product,file,authentication)));
//    }
//    @GetMapping("/statistics/product")
//    public ResponseEntity<?> getStatistics(Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(ApiResponseFactory.created("createProduct", productService.getStatisticsByCustomer(authentication)));
//    }
//    @GetMapping("/detail-product-in-parcel")
//    public ResponseEntity<?> getProductsInParcel(@RequestParam String parcelId, Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("getProductsInParcel",productParcelService.getProductsByParcelId(parcelId,authentication)));
//    }
//}
