package com.ntt.elogistics.controllers;

import com.ntt.elogistics.enums.ImageParcelType;
import com.ntt.elogistics.enums.ParcelStatus;
import com.ntt.elogistics.helpers.ApiResponseFactory;
import com.ntt.elogistics.models.Parcel;
import com.ntt.elogistics.services.ImageParcelService;
import com.ntt.elogistics.services.ParcelService;
import com.ntt.elogistics.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/shipper")
@PreAuthorize("hasAnyRole('SHIPPER')")
public class ShipperController {

    private final ParcelService parcelService;
    private final UserService userService;
    private final ImageParcelService imageParcelService;

    @GetMapping("/parcel")
    public ResponseEntity<?> getParcels(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) ParcelStatus status,
            @RequestParam(defaultValue = "") String search
    ) {
        Page<Parcel> parcelPage = parcelService.shipperGetParcelsPage(page, size, type, status, search, authentication);

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
                .body(ApiResponseFactory.success("getParcel", parcelService.shipperGetParcelById(id, authentication)));
    }

    @PutMapping("/parcel/{id}")
    public ResponseEntity<?> updateStatusParcel(@PathVariable Long id,
                                                @RequestParam ParcelStatus status,
                                                Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getParcel", parcelService.shipperUpdateStatusParcel(id, status, authentication)));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getStats", parcelService.countByStatusPickupOrDeliveryShipperId(authentication)));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImages(@RequestParam("files") List<MultipartFile> files, @RequestParam Long parcelId, @RequestParam ImageParcelType type) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("Upload images thành công", imageParcelService.uploadImages(parcelId.toString(), type, files)));
    }


}
