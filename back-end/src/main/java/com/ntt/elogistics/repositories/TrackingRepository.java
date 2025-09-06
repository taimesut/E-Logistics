package com.ntt.elogistics.repositories;

import com.ntt.elogistics.models.Tracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackingRepository extends JpaRepository<Tracking,Long> {
    List<Tracking> findByParcelIdOrderByUpdateAtDesc(String parcelId);

}
