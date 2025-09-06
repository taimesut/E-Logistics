package com.ntt.elogistics.controllers;

import com.ntt.elogistics.dtos.responses.AdminStatisticResponse;
import com.ntt.elogistics.dtos.responses.CustomerStatisticResponse;
import com.ntt.elogistics.dtos.responses.ManagerStatisticResponse;
import com.ntt.elogistics.dtos.responses.ShipperStatisticResponse;
import com.ntt.elogistics.services.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/statistics")
public class StatisticController {
    private final StatisticService statisticService;

    @PreAuthorize("hasAnyRole('CUSTOMER')")
    @GetMapping("/customer")
    public ResponseEntity<CustomerStatisticResponse> getCustomerStatistic(Authentication authentication) {
        return ResponseEntity.ok(statisticService.statisticCustomer(authentication));
    }

    @PreAuthorize("hasAnyRole('SHIPPER')")
    @GetMapping("/shipper")
    public ResponseEntity<ShipperStatisticResponse> getShipperStatistic(Authentication authentication) {
        return ResponseEntity.ok(statisticService.statisticShipper(authentication));
    }

    @PreAuthorize("hasAnyRole('MANAGER')")
    @GetMapping("/manager")
    public ResponseEntity<ManagerStatisticResponse> getManagerStatistic(Authentication authentication) {
        return ResponseEntity.ok(statisticService.statisticManager(authentication));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<AdminStatisticResponse> getAdminStatistic() {
        return ResponseEntity.ok(statisticService.statisticAdmin());
    }
}
