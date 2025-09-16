package com.ntt.elogistics.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ntt.elogistics.enums.ParcelStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "t_parcel")
public class Parcel {
    @Id
    private UUID id;
    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String fromName;
    @Column(nullable = false)
    private String fromPhone;
    @Column(nullable = false)
    private String fromProvince;
    @Column(nullable = false)
    private String fromDistrict;
    @Column(nullable = false)
    private String fromWard;
    @Column(nullable = false)
    private String fromStreet;
    private String fromBranchId;
    private double fromLat;// vĩ
    private double fromLng;// kinh

    @Column(nullable = false)
    private String toName;
    @Column(nullable = false)
    private String toPhone;
    @Column(nullable = false)
    private String toProvince;
    @Column(nullable = false)
    private String toDistrict;
    @Column(nullable = false)
    private String toWard;
    @Column(nullable = false)
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

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updateAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private double weightChargeable;

    private double shippingFee;

    private String pickupShipperId;
    private String deliveryShipperId;






}
