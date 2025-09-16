package com.ntt.elogistics.controllers;

import com.ntt.elogistics.dtos.goong.Location;
import com.ntt.elogistics.helpers.ApiResponseFactory;
import com.ntt.elogistics.repositories.ShippingRuleRepository;
import com.ntt.elogistics.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public")
public class PublicController {
    private final TrackingService trackingService;
    private final GoongService goongService;
    private final ShippingFeeService shippingFeeService;
    private final PasswordResetService passwordResetService;
    private final UserService userService;
    private final ShippingRuleRepository shippingRuleRepository;

    @GetMapping("/tracking")
    public ResponseEntity<?> tracking (@RequestParam String code){
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("tracking", trackingService.tracking(code)));
    }

    @GetMapping("/check-fee")
    public ResponseEntity<?> checkCost(@RequestParam double weight,
                                       @RequestParam double length,
                                       @RequestParam double width,
                                       @RequestParam double height,
                                       @RequestParam String fromProvince,
                                       @RequestParam String toProvince){
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("checkCost", shippingFeeService.checkFeeResponse(weight,length,width,height,fromProvince,toProvince)));
    }

    @GetMapping("/get-location")
    public ResponseEntity<?> getLocationFromAddress (@RequestParam String address){
        try {
            Location location = goongService.getLocationFromAddress(address);
            return ResponseEntity.ok(ApiResponseFactory.success("getLocationFromAddress", location));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseFactory.error("Lỗi khi gọi Goong API: " + e.getMessage()));
        }
    }

    @GetMapping("/reset-password")
    public ResponseEntity<?> createRequestResetPassword(@RequestParam String email){
        passwordResetService.createPasswordResetToken(email);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("ResetPassWord",null));
    }

    @GetMapping("/confirm-reset-password")
    public ResponseEntity<?> confirmToken(@RequestParam String token, @RequestParam String newPassword){
        passwordResetService.resetPassword(token,newPassword);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("confirmToken",null));
    }

    @GetMapping("/shipping-rule")
    public ResponseEntity<?> getShippingRule(){
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getShippingRule", shippingRuleRepository.findAll()));
    }

}
