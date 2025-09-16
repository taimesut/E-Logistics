package com.ntt.elogistics.repositories;

import com.ntt.elogistics.models.Tracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TrackingRepository extends JpaRepository<Tracking, UUID> {
    List<Tracking> findByParcelIdOrderByUpdateAtDesc(String parcelId);

}
