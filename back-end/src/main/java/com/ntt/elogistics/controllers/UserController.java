package com.ntt.elogistics.controllers;

import com.ntt.elogistics.dtos.requests.ChangePasswordRequest;
import com.ntt.elogistics.helpers.ApiResponseFactory;
import com.ntt.elogistics.models.User;
import com.ntt.elogistics.services.ImageParcelService;
import com.ntt.elogistics.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasAnyRole('CUSTOMER', 'SHIPPER', 'MANAGER', 'ADMIN')")
public class UserController {

    private final UserService userService;
    private final ImageParcelService imageParcelService;


    @GetMapping("/profile")
    public ResponseEntity<?> profile(Authentication authentication) {
        User response = userService.getProfileByUsername(authentication.getName());
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("Thành công", response));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request, Authentication authentication) {

        userService.ChangePassword(request, authentication);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("Đổi mật khẩu thành công", null));
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file, Authentication authentication) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("Cập nhật avatar thành công", userService.uploadAvatar(file, authentication)));
    }

    @GetMapping("/update-address")
    public ResponseEntity<?> updateAddress(@RequestParam("province") String province,
                                          @RequestParam("district") String district,
                                          @RequestParam("ward") String ward,
                                          @RequestParam("address") String address,
                                          Authentication authentication) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("Cập nhật địa chỉ thành công", userService.updateAddress(province, district, ward, address, authentication)));
    }

    @GetMapping("/images-parcel")
    public ResponseEntity<?> getImagesParcel(@RequestParam("id") Long id) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getImagesParcel", imageParcelService.getImagesParcel(id.toString())));
    }


}
