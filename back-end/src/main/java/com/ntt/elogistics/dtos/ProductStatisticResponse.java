package com.ntt.elogistics.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductStatisticResponse {
    private Long productId;
    private String name;
    private long soldQuantity;
    private int remainingQuantity;
    private double revenue;
}
