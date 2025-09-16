package com.ntt.elogistics.controllers;

import com.ntt.elogistics.dtos.CreateParcelRequest;
import com.ntt.elogistics.enums.ImageParcelType;
import com.ntt.elogistics.enums.ParcelStatus;
import com.ntt.elogistics.helpers.ApiResponseFactory;
import com.ntt.elogistics.models.Parcel;
import com.ntt.elogistics.services.ImageParcelService;
import com.ntt.elogistics.services.ParcelService;
import com.ntt.elogistics.services.ProductParcelService;
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
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/parcel")
@PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','SHIPPER','MANAGER')")
public class ParcelController {
    private final ParcelService parcelService;
    private final ProductParcelService productParcelService;
    private final ImageParcelService imageParcelService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping()
    public ResponseEntity<?> createParcel(@RequestBody CreateParcelRequest request, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("createParcel", parcelService.customerCreateParcel(request, authentication)));
    }

    @GetMapping()
    public ResponseEntity<?> getParcels(Authentication authentication,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size,
                                        @RequestParam(required = false) ParcelStatus status,
                                        @RequestParam(required = false) String typeParcel,
                                        @RequestParam(defaultValue = "") String search) {
        Page<Parcel> parcelPage = parcelService.getParcelPage(page, size, status, search, authentication);

        Map<String, Object> response = new HashMap<>();
        response.put("data", parcelPage.getContent());
        response.put("currentPage", parcelPage.getNumber());
        response.put("totalItems", parcelPage.getTotalElements());
        response.put("totalPages", parcelPage.getTotalPages());

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("get list parcel", response));
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getParcel(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("get parcel by id", parcelService.getParcelById(id, authentication)));
    }

    @PutMapping("{id}")
    public ResponseEntity<?> putParcel(@PathVariable UUID id,
                                       @RequestParam(required = false) ParcelStatus status,
                                       @RequestParam(required = false) String shipperId,
                                       @RequestParam(required = false) String typeShipper,
                                       Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("update parcel by id", parcelService.updateParcelById(id, status,shipperId, typeShipper, authentication)));
    }

    @GetMapping("/detail-product-in-parcel")
    public ResponseEntity<?> getProductsInParcel(@RequestParam String parcelId, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getProductsInParcel", productParcelService.getProductsByParcelId(parcelId, authentication)));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImages(@RequestParam("files") List<MultipartFile> files, @RequestParam UUID parcelId, @RequestParam ImageParcelType type) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("Upload images thành công", imageParcelService.uploadImages(parcelId.toString(), type, files)));
    }

}
