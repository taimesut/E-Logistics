package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.responses.CheckFeeResponse;
import com.ntt.elogistics.models.Parcel;
import com.ntt.elogistics.models.ShippingRule;
import com.ntt.elogistics.repositories.ShippingRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShippingFeeService {

    private final ShippingRuleRepository shippingRuleRepository;

    public double getShippingFee(String from, String to, double weight) {
        boolean noiTinh = from.equalsIgnoreCase(to);

        if (weight <= 3) {
            ShippingRule rule = shippingRuleRepository.findByWeight(weight);
            return noiTinh ? rule.getNoiTinh() : rule.getLienTinh();
        }

        ShippingRule baseRule = shippingRuleRepository.findSecondMaxWeightRule();
        ShippingRule extraRule = shippingRuleRepository.findFirstMaxWeightRule();

        double baseFee = noiTinh ? baseRule.getNoiTinh() : baseRule.getLienTinh();
        double extraKg = Math.ceil(weight - 3);
        double extraFee = extraKg * (noiTinh ? extraRule.getNoiTinh() : extraRule.getLienTinh());

        return baseFee + extraFee;
    }

    public double getChargeableWeight(Parcel parcel) {
        double volumetricWeight = (parcel.getLength() * parcel.getWidth() * parcel.getHeight()) / 5000;
        return Math.max(parcel.getWeight(), volumetricWeight);
    }

    public double getChargeableWeight(double weight, double length, double width, double height) {
        double volumetricWeight = (length * width * height) / 5000;
        return Math.max(weight, volumetricWeight);
    }

    public CheckFeeResponse checkFeeResponse (double weight, double length, double width, double height, String from, String to){
        double chargeableWeight = getChargeableWeight(weight,length,width,height);

        return CheckFeeResponse.builder()
                .weightChargeable(chargeableWeight)
                .shippingFee(getShippingFee(from,to,chargeableWeight))
                .build();
    }
}

