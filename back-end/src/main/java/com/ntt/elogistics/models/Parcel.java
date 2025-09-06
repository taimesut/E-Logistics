package com.ntt.elogistics.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ntt.elogistics.enums.ParcelStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "t_parcel")
public class Parcel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    private String userId;

    private String fromName;
    private String fromPhone;
    private String fromProvince;
    private String fromDistrict;
    private String fromWard;
    private String fromStreet;
    private String fromBranchId;
    private double fromLat;// vĩ
    private double fromLng;// kinh

    private String toName;
    private String toPhone;
    private String toProvince;
    private String toDistrict;
    private String toWard;
    private String toStreet;
    private String toBranchId;
    private double toLat;// vĩ
    private double toLng;// kinh

    private double weight;
    private double length;
    private double width;
    private double height;

    @Enumerated(EnumType.STRING)
    private ParcelStatus status;

    private LocalDateTime updateAt;
    private LocalDateTime createAt;

    private double weightChargeable;

    private double shippingFee;

    private String pickupShipperId;
    private String deliveryShipperId;


    @PrePersist
    protected void onCreate() {
        updateAt = LocalDateTime.now();
        createAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updateAt = LocalDateTime.now();
    }



}
