package com.ntt.elogistics.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductInParcelCreateRequest {
    private String productId;
    private int quantity;
    private double price;
}
