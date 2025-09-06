package com.ntt.elogistics.models;

import com.ntt.elogistics.enums.ImageParcelType;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "t_image_parcel")
public class ImageParcel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String url;
    private String parcelId;
    @Enumerated(EnumType.STRING)
    private ImageParcelType type;
}
