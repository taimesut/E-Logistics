package com.ntt.elogistics.controllers;

import com.ntt.elogistics.helpers.ApiResponseFactory;
import com.ntt.elogistics.models.ShippingRule;
import com.ntt.elogistics.repositories.ShippingRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/shipping-rule")
public class ShippingRuleController {
    private final ShippingRuleRepository shippingRuleRepository;

    @GetMapping()
    public ResponseEntity<?> getShippingRule() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getShippingRule", shippingRuleRepository.findAll()));
    }

    @PostMapping()
    public ResponseEntity<?> setShippingRule(@RequestBody List<ShippingRule> rules) {
        shippingRuleRepository.deleteAll();
        rules.forEach(r -> r.setId(null));
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getShippingRule", shippingRuleRepository.saveAll(rules)));
    }
}
