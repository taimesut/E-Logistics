package com.ntt.elogistics.models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "t_shipping_rule")
public class ShippingRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double minWeight;
    private double maxWeight;

    private int noiTinh;
    private int lienTinh;

}
