package com.ntt.elogistics.controllers;

import com.ntt.elogistics.dtos.ChangePasswordRequest;
import com.ntt.elogistics.dtos.CreateAccountRequest;
import com.ntt.elogistics.dtos.UpdateAccountRequest;
import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.enums.UserStatus;
import com.ntt.elogistics.helpers.ApiResponseFactory;
import com.ntt.elogistics.models.User;
import com.ntt.elogistics.services.ImageParcelService;
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
import java.util.Map;
import java.util.UUID;

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
    public ResponseEntity<?> getImagesParcel(@RequestParam("id") UUID id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getImagesParcel", imageParcelService.getImagesParcel(id.toString())));
    }


    @GetMapping("")
    public ResponseEntity<?> getAccounts(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size,
                                       @RequestParam(required = false) UserRole role,
                                       @RequestParam(defaultValue = "") UserStatus status,
                                       @RequestParam(defaultValue = "") String search) {
        Page<User> userPage = userService.getAllAccount(page, size, search,role,status);

        Map<String, Object> response = new HashMap<>();
        response.put("data", userPage.getContent());
        response.put("currentPage", userPage.getNumber());
        response.put("totalItems", userPage.getTotalElements());
        response.put("totalPages", userPage.getTotalPages());

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getAccounts", response));
    }

    @PostMapping("")
    public ResponseEntity<?> createAccount(@RequestBody CreateAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("createAccount", userService.adminCreateAccount(request)));
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateAccount(@RequestBody UpdateAccountRequest request, @PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("updateAccount", userService.adminUpdateAccount(request, id)));
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getAccount(@PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getAccount", userService.adminGetAccountById(id)));
    }

    @GetMapping("/shipper")
    public ResponseEntity<?> getShippers(Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getShippers", userService.getShippersForBranch(authentication)));
    }

    @GetMapping("/shipper/{id}")
    public ResponseEntity<?> getShipper(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getShippers", userService.getShipperById(id, authentication)));
    }
}
