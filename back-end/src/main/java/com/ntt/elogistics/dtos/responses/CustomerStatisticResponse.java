package com.ntt.elogistics.dtos.responses;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerStatisticResponse {
    private long totalParcels;
    private Map<String, Long> statusCount;
    private double totalShippingFee;
}
