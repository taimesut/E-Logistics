//package com.ntt.elogistics.controllers;
//
//import com.cloudinary.Api;
//import com.ntt.elogistics.enums.ParcelStatus;
//import com.ntt.elogistics.helpers.ApiResponseFactory;
//import com.ntt.elogistics.models.Parcel;
//import com.ntt.elogistics.services.ParcelService;
//import com.ntt.elogistics.services.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@RequiredArgsConstructor
//@RestController
//@RequestMapping("/api/manager")
//@PreAuthorize("hasAnyRole('MANAGER')")
//public class ManagerController {
//
//    private final ParcelService parcelService;
//    private final UserService userService;
//
//    @GetMapping("/parcel")
//    public ResponseEntity<?> getParcels(
//            Authentication authentication,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size,
//            @RequestParam(required = false) String type,
//            @RequestParam(required = false) ParcelStatus status,
//            @RequestParam(defaultValue = "") String search
//    ) {
//        Page<Parcel> parcelPage = parcelService.managerGetParcelsPage(page, size, type, status,search, authentication);
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
//                .body(ApiResponseFactory.success("getParcel", parcelService.managerGetParcelById(id, authentication)));
//    }
//
//    @GetMapping("/shipper")
//    public ResponseEntity<?> getShippers(Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("getShippers", userService.managerGetShippers(authentication)));
//    }
//
//    @GetMapping("/shipper/{id}")
//    public ResponseEntity<?> getShipper(@PathVariable Long id, Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("getShippers", userService.managerGetShipper(id, authentication)));
//    }
//
//    @PutMapping(value = "/parcel/{id}", params = {"shipperId", "type"})
//    public ResponseEntity<?> setShipper(@PathVariable Long id, @RequestParam int shipperId, @RequestParam String type) {
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("getShippers", parcelService.managerSetShipper(id, shipperId, type)));
//    }
//
//    @PutMapping(value = "/parcel/{id}", params = {"status"})
//    public ResponseEntity<?> setStatusParcel(@PathVariable Long id, @RequestParam ParcelStatus status, Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("setStatusParcel", parcelService.managerSetStatusParcel(id, status, authentication)));
//    }
//
//    @GetMapping("/stats")
//    public ResponseEntity<?> getStatsToBranch(Authentication authentication) {
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ApiResponseFactory.success("", parcelService.countByStatusFromOrToBranch(authentication)));
//    }
//}
