package com.ntt.elogistics.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "t_product_parcel")
public class ProductParcel {
    @Id
    private UUID id;
    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }

    @Column(nullable = false)
    private String productId;
    @Column(nullable = false)
    private String parcelId;
    @Column(nullable = false)
    private int quantity;
    @Column(nullable = false)
    private double price;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updateAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
