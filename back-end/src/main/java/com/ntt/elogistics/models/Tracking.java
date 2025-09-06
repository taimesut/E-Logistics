package com.ntt.elogistics.models;

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
@Table(name = "t_tracking")
public class Tracking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String parcelId;

    @Enumerated(EnumType.STRING)
    private ParcelStatus status;

    private LocalDateTime updateAt;

    private String description;

    @PrePersist
    public void prePersist() {
        this.updateAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updateAt = LocalDateTime.now();
    }


}
