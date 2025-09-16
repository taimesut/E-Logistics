package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.AdminStatisticResponse;
import com.ntt.elogistics.dtos.CustomerStatisticResponse;
import com.ntt.elogistics.dtos.ManagerStatisticResponse;
import com.ntt.elogistics.dtos.ShipperStatisticResponse;
import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.exceptions.NotFoundUsernameException;
import com.ntt.elogistics.repositories.BranchRepository;
import com.ntt.elogistics.repositories.ParcelRepository;
import com.ntt.elogistics.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticService {
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
    public List<Object[]> customer (LocalDateTime start, LocalDateTime end, Authentication authentication){
        return parcelRepository.statsCustomer(getUserIdToStringFromAuthentication(authentication),start,end);
    }

    public Map<String,Long> shipper (Authentication authentication){
        return null;
    }

    public Map<String,Long> manager (Authentication authentication){
        return null;
    }

    public Map<String,Long> admin (Authentication authentication){
        return null;
    }



}
