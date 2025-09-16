package com.ntt.elogistics.controllers;

import com.ntt.elogistics.dtos.AdminStatisticResponse;
import com.ntt.elogistics.dtos.CustomerStatisticResponse;
import com.ntt.elogistics.dtos.ManagerStatisticResponse;
import com.ntt.elogistics.dtos.ShipperStatisticResponse;
import com.ntt.elogistics.services.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/statistics")
@PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','SHIPPER','MANAGER')")
public class StatisticController {
    private final StatisticService statisticService;

    @PreAuthorize("hasAnyRole('CUSTOMER')")
    @GetMapping("/customer")
    public ResponseEntity<?> getCustomerStatistic(Authentication authentication,
                                                  @RequestParam LocalDateTime startDate,
                                                  @RequestParam LocalDateTime endDate) {
        return ResponseEntity.ok(statisticService.customer(startDate,endDate,authentication));
    }

    @PreAuthorize("hasAnyRole('SHIPPER')")
    @GetMapping("/shipper")
    public ResponseEntity<?> getShipperStatistic(Authentication authentication) {
        return ResponseEntity.ok(statisticService.shipper(authentication));
    }

    @PreAuthorize("hasAnyRole('MANAGER')")
    @GetMapping("/manager")
    public ResponseEntity<?> getManagerStatistic(Authentication authentication) {
        return ResponseEntity.ok(statisticService.manager(authentication));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<?> getAdminStatistic(Authentication authentication) {
        return ResponseEntity.ok(statisticService.admin(authentication));
    }
}
