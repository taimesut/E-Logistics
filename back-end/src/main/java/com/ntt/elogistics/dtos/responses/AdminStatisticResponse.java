package com.ntt.elogistics.dtos.responses;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminStatisticResponse {
    private long totalCustomers;
    private long totalShippers;
    private long totalManagers;
    private long totalBranches;
    private long totalParcels;
    private Map<String, Long> statusCount;
    private double totalRevenue;
}
