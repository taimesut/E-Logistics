package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.ParcelStatusCountDto;
import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.enums.ParcelStatus;
import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.exceptions.NotFoundUsernameException;
import com.ntt.elogistics.repositories.BranchRepository;
import com.ntt.elogistics.repositories.ParcelRepository;
import com.ntt.elogistics.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashbroadService {
    private final ParcelRepository parcelRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;

    public String getUserIdToStringFromAuthentication(Authentication authentication) {
        return userRepository.findIdByUsername(authentication.getName())
                .orElseThrow(NotFoundUsernameException::new)
                .toString();
    }

    public String getBranchWorkFromAuthentication(Authentication authentication) {
        return userRepository.findBranchWorkIdByUsername(authentication.getName());
    }

    public Map<ParcelStatus, Long> customer(Authentication authentication) {
        List<Object[]> list = parcelRepository.dashboardCustomer(getUserIdToStringFromAuthentication(authentication));
        return list.stream()
                .collect(Collectors.toMap(
                        r -> (ParcelStatus) r[0],
                        r -> (Long) r[1]
                ));
    }

    private Map<ParcelStatus, Long> convertToMap(List<Object[]> rawList) {
        return rawList.stream()
                .collect(Collectors.toMap(
                        r -> (ParcelStatus) r[0],
                        r -> (Long) r[1]
                ));
    }

    public Map<ParcelStatus, Long> shipper(Authentication authentication) {
        // list lay hang
        List<Object[]> listPickup = parcelRepository
                .dashboardShipperPickup(
                        getUserIdToStringFromAuthentication(authentication),
                        List.of(
                                ParcelStatus.PICKUP_IN_PROGRESS,
                                ParcelStatus.CANCELLED,
                                ParcelStatus.PICKUP_SUCCESS,
                                ParcelStatus.PICKUP_FAILED,
                                ParcelStatus.IN_TRANSIT_TO_FROM_BRANCH
                        ));

        // list giao hang
        List<Object[]> listDelivery = parcelRepository
                .dashboardShipperDelivery(
                        getUserIdToStringFromAuthentication(authentication),
                        List.of(
                                ParcelStatus.DELIVERY_IN_PROGRESS,
                                ParcelStatus.DELIVERED,
                                ParcelStatus.DELIVERY_FAILED,
                                ParcelStatus.RETURNED
                        ));

        Map<ParcelStatus, Long> pickupMap = convertToMap(listPickup);
        Map<ParcelStatus, Long> deliveryMap = convertToMap(listDelivery);

        Map<ParcelStatus, Long> result = new HashMap<>(pickupMap);
        deliveryMap.forEach((status, count) ->
                result.merge(status, count, Long::sum)
        );

        return result;
    }

    public Map<ParcelStatus, Long> manager(Authentication authentication) {
        // list lay hang
        List<Object[]> listPickup = parcelRepository
                .dashboardManagerPickup(
                        getBranchWorkFromAuthentication(authentication),
                        List.of(
                                ParcelStatus.PICKUP_IN_PROGRESS,
                                ParcelStatus.CREATED,
                                ParcelStatus.CANCELLED,
                                ParcelStatus.PICKUP_SUCCESS,
                                ParcelStatus.PICKUP_FAILED,
                                ParcelStatus.IN_TRANSIT_TO_FROM_BRANCH,
                                ParcelStatus.AT_FROM_BRANCH
                        ));

        // list giao hang
        List<Object[]> listDelivery = parcelRepository
                .dashboardManagerDelivery(
                        getBranchWorkFromAuthentication(authentication),
                        List.of(
                                ParcelStatus.IN_TRANSIT_TO_TO_BRANCH,
                                ParcelStatus.AT_TO_BRANCH,
                                ParcelStatus.DELIVERY_IN_PROGRESS,
                                ParcelStatus.DELIVERED,
                                ParcelStatus.DELIVERY_FAILED,
                                ParcelStatus.RETURNED
                        ));

        Map<ParcelStatus, Long> pickupMap = convertToMap(listPickup);
        Map<ParcelStatus, Long> deliveryMap = convertToMap(listDelivery);

        Map<ParcelStatus, Long> result = new HashMap<>(pickupMap);
        deliveryMap.forEach((status, count) ->
                result.merge(status, count, Long::sum)
        );

        return result;
    }

    public Map<String, Long> admin(Authentication authentication) {
        Map<String, Long> result = new HashMap<>();
        result.put("CUSTOMER", userRepository.countByRole(UserRole.ROLE_CUSTOMER));
        result.put("MANAGER", userRepository.countByRole(UserRole.ROLE_MANAGER));
        result.put("SHIPPER", userRepository.countByRole(UserRole.ROLE_SHIPPER));
        result.put("BRANCHES_ACTIVE", branchRepository.countByStatus(BranchStatus.ACTIVE));
        result.put("BRANCHES_INACTIVE", branchRepository.countByStatus(BranchStatus.INACTIVE));
        return result;
    }
}
