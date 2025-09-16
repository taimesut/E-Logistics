package com.ntt.elogistics.models;

import com.ntt.elogistics.enums.ImageParcelType;
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
@Table(name = "t_image_parcel")
public class ImageParcel {
    @Id
    private UUID id;
    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }
    @Column(nullable = false)
    private String url;
    @Column(nullable = false)
    private String parcelId;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ImageParcelType type;
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updateAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
