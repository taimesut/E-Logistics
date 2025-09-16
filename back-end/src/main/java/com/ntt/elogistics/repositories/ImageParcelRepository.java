package com.ntt.elogistics.repositories;

import com.ntt.elogistics.models.ImageParcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ImageParcelRepository extends JpaRepository<ImageParcel, UUID> {
    @Query(
            value = "SELECT * FROM t_image_parcel " +
                    "WHERE parcel_id = :parcelId",
            nativeQuery = true
    )
    List<ImageParcel> findByParcelId(
            @Param("parcelId") String parcelId
    );
}
