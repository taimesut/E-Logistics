package com.ntt.elogistics.controllers;

import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.helpers.ApiResponseFactory;
import com.ntt.elogistics.services.DashbroadService;
import com.ntt.elogistics.services.ParcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
@PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','SHIPPER','MANAGER')")
public class DashboardController {

    private final DashbroadService dashbroadService;

    @GetMapping("/shipper")
    public ResponseEntity<?> shipper(Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("get dashboard shipper", dashbroadService.shipper(authentication)));
    }

    @GetMapping("/admin")
    public ResponseEntity<?> admin(Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("get dashboard admin", dashbroadService.admin(authentication)));
    }

    @GetMapping("/customer")
    public ResponseEntity<?> customer(Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("get dashboard customer", dashbroadService.customer(authentication)));
    }

    @GetMapping("/manager")
    public ResponseEntity<?> manager(Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("get dashboard manager", dashbroadService.manager(authentication)));
    }
}
