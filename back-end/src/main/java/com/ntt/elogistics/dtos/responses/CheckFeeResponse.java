package com.ntt.elogistics.dtos.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckFeeResponse {
    private double shippingFee;
    private double weightChargeable;
}
