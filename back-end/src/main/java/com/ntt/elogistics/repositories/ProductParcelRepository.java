package com.ntt.elogistics.repositories;

import com.ntt.elogistics.models.ProductParcel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProductParcelRepository extends JpaRepository<ProductParcel, UUID> {
    List<ProductParcel> findByParcelId(String parcelId);

    List<ProductParcel> findByProductId(String productId);
}
