package com.ntt.elogistics.controllers;

import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.enums.ParcelStatus;
import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.helpers.ApiResponseFactory;
import com.ntt.elogistics.models.Parcel;
import com.ntt.elogistics.services.ParcelService;
import com.ntt.elogistics.dtos.requests.CreateParcelRequest;
import com.ntt.elogistics.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {
    private final ParcelService parcelService;
    private final UserService userService;

    @PostMapping("/parcel")
    public ResponseEntity<?> createParcel(@RequestBody CreateParcelRequest request, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("createParcel", parcelService.customerCreateParcel(request, authentication)));
    }

    @GetMapping("/parcel")
    public ResponseEntity<?> getParcels(Authentication authentication,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size,
                                        @RequestParam(required = false) ParcelStatus status,
                                        @RequestParam(defaultValue = "") String search) {
        Page<Parcel> parcelPage = parcelService.customerGetParcelsPage(page, size, status,search, authentication);

        Map<String, Object> response = new HashMap<>();
        response.put("data", parcelPage.getContent());
        response.put("currentPage", parcelPage.getNumber());
        response.put("totalItems", parcelPage.getTotalElements());
        response.put("totalPages", parcelPage.getTotalPages());

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getParcels", response));
    }

    @GetMapping("/parcel/{id}")
    public ResponseEntity<?> getParcel(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getParcel", parcelService.customerGetParcelById(id, authentication)));
    }

    @GetMapping("/shipper/{id}")
    public ResponseEntity<?> getShipper(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getShippers", userService.customerGetShipper(id, authentication)));
    }

    @PutMapping("/parcel/{id}")
    public ResponseEntity<?> cancelParcel(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("cancelParcel", parcelService.customerCancelParcelById(id, authentication)));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        response.put("SUM", parcelService.customerCountParcel(authentication));
        for (ParcelStatus status : ParcelStatus.values()) {
            long count = parcelService.customerCountParcelByStatus(authentication, status);
            response.put(status.name(), count);
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getStats", response));
    }

}
