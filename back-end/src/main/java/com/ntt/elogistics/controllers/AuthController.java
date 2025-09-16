package com.ntt.elogistics.controllers;

import com.ntt.elogistics.dtos.LoginRequest;
import com.ntt.elogistics.dtos.LoginResponse;
import com.ntt.elogistics.dtos.RegisterRequest;
import com.ntt.elogistics.helpers.ApiResponseFactory;
import com.ntt.elogistics.services.AuthService;
import com.ntt.elogistics.services.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.success("Đăng ký tài khoản thành công",null));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = authService.login(loginRequest);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("Đăng nhập thành công",loginResponse));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        passwordResetService.createPasswordResetToken(email);
        return ResponseEntity.ok("Đã gửi link reset mật khẩu đến email của bạn");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token,
                                           @RequestParam String newPassword) {
        passwordResetService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Đặt lại mật khẩu thành công");
    }
}
