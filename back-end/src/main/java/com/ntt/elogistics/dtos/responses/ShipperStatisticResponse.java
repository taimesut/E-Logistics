package com.ntt.elogistics.dtos.responses;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShipperStatisticResponse {
    private long totalParcels;
    private Map<String, Long> statusCount;
    private long successParcels;
    private long failedParcels;
}
