package com.ntt.elogistics.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckFeeResponse {
    private double shippingFee;
    private double weightChargeable;
}
