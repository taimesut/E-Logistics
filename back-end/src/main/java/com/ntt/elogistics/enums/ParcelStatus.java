package com.ntt.elogistics.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ParcelStatus {
    CREATED("Tạo đơn hàng thành công"),
    CANCELLED("Đơn hàng đã bị hủy"),

    PICKUP_IN_PROGRESS("Shipper đang lấy hàng từ người gửi"),
    PICKUP_FAILED("Lấy hàng thất bại."),
    PICKUP_SUCCESS("Lấy hàng thành công"),

    AT_FROM_BRANCH("Đơn đã đến bưu cục lấy hàng"),
    AT_TO_BRANCH("Đơn đã đến bưu cục giao hàng"),

    IN_TRANSIT_TO_TO_BRANCH("Đang vận chuyển tới bưu cục giao hàng"),
    IN_TRANSIT_TO_FROM_BRANCH("Đang vận chuyển tới bưu cục lấy hàng"),

    DELIVERY_IN_PROGRESS("Shipper đang giao hàng cho người nhận"),
    DELIVERY_FAILED("Giao hàng thất bại"),
    DELIVERED("Giao hàng thành công"),


    RETURNED("Đơn hàng đã hoàn trả thành công");

    private final String description;

    public String getDescription(){
        return description.formatted();
    }
}
