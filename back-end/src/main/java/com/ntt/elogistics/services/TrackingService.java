package com.ntt.elogistics.services;

import com.ntt.elogistics.enums.ParcelStatus;
import com.ntt.elogistics.models.Tracking;
import com.ntt.elogistics.repositories.TrackingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrackingService {
    private final TrackingRepository trackingRepository;
    private final MailService mailService;

    public void createTracking(String parcelId, ParcelStatus status){
        Tracking model = Tracking.builder()
                .description(status.getDescription())
                .status(status)
                .parcelId(parcelId)
                .build();
        trackingRepository.save(model);
    }


    public List<Tracking> tracking (String code){
        return trackingRepository.findByParcelIdOrderByUpdateAtDesc(code);
    }


}
