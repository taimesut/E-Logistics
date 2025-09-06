package com.ntt.elogistics.repositories;

import com.ntt.elogistics.models.ShippingRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShippingRuleRepository extends JpaRepository<ShippingRule, Long> {
    @Query("SELECT r FROM ShippingRule r " +
            "WHERE :weight > r.minWeight AND :weight <= r.maxWeight")
    ShippingRule findByWeight(@Param("weight") double weight);

    @Query(value = "SELECT * FROM t_shipping_rule ORDER BY max_weight DESC LIMIT 1",
            nativeQuery = true)
    ShippingRule findFirstMaxWeightRule();

    @Query(value = "SELECT * FROM t_shipping_rule ORDER BY max_weight DESC LIMIT 1 OFFSET 1",
            nativeQuery = true)
    ShippingRule findSecondMaxWeightRule();
}
