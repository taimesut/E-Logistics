package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.responses.AdminStatisticResponse;
import com.ntt.elogistics.dtos.responses.CustomerStatisticResponse;
import com.ntt.elogistics.dtos.responses.ManagerStatisticResponse;
import com.ntt.elogistics.dtos.responses.ShipperStatisticResponse;
import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.repositories.BranchRepository;
import com.ntt.elogistics.repositories.ParcelRepository;
import com.ntt.elogistics.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticService {
    private final ParcelRepository parcelRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;

    public CustomerStatisticResponse statisticCustomer(Authentication authentication) {
        String userId = String.valueOf(userRepository.findIdByUsername(authentication.getName()).get());
        long totalParcels = parcelRepository.countByUserId(userId);

        Map<String, Long> statusCount = parcelRepository.countByStatus(userId).stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),   // status
                        row -> (Long) row[1]        // count
                ));

        double totalShippingFee = parcelRepository.totalShippingFee(userId);

        return CustomerStatisticResponse.builder()
                .totalParcels(totalParcels)
                .statusCount(statusCount)
                .totalShippingFee(totalShippingFee)
                .build();
    }

    public ShipperStatisticResponse statisticShipper(Authentication authentication) {
        String shipperId = String.valueOf(userRepository.findIdByUsername(authentication.getName()).get());

        long totalParcels = parcelRepository.countByShipper(shipperId);

        Map<String, Long> statusCount = parcelRepository.countByStatusForShipper(shipperId).stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> (Long) row[1]
                ));

        long successParcels = statusCount.getOrDefault("DELIVERED", 0L);
        long failedParcels = statusCount.getOrDefault("CANCELLED", 0L);

        return ShipperStatisticResponse.builder()
                .totalParcels(totalParcels)
                .statusCount(statusCount)
                .successParcels(successParcels)
                .failedParcels(failedParcels)
                .build();
    }

    public ManagerStatisticResponse statisticManager(Authentication authentication) {
        String branchId = userRepository.findBranchWorkIdByUsername(authentication.getName());
        long totalParcels = parcelRepository.countByBranch(branchId);

        Map<String, Long> statusCount = parcelRepository.countByStatusForBranch(branchId).stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),   // status
                        row -> (Long) row[1]        // count
                ));

        double totalRevenue = parcelRepository.totalRevenue(branchId);
        long activeShippers = userRepository.countActiveShippers(branchId);

        return ManagerStatisticResponse.builder()
                .totalParcels(totalParcels)
                .statusCount(statusCount)
                .totalRevenue(totalRevenue)
                .activeShippers(activeShippers)
                .build();
    }

    public AdminStatisticResponse statisticAdmin() {
        long totalCustomers = userRepository.countByRole(UserRole.ROLE_CUSTOMER);
        long totalShippers = userRepository.countByRole(UserRole.ROLE_SHIPPER);
        long totalManagers = userRepository.countByRole(UserRole.ROLE_MANAGER);
        long totalBranches = branchRepository.count();
        long totalParcels = parcelRepository.count();

        Map<String, Long> statusCount = parcelRepository.countParcelsByStatus().stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> (Long) row[1]
                ));

        double totalRevenue = parcelRepository.totalRevenue();

        return AdminStatisticResponse.builder()
                .totalCustomers(totalCustomers)
                .totalShippers(totalShippers)
                .totalManagers(totalManagers)
                .totalBranches(totalBranches)
                .totalParcels(totalParcels)
                .statusCount(statusCount)
                .totalRevenue(totalRevenue)
                .build();
    }

}
