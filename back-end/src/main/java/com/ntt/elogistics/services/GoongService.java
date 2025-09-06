package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.goong.GeocodeResponse;
import com.ntt.elogistics.dtos.goong.Location;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class GoongService {
    @Value("${goong.key.api}")
    private String keyApi;
    @Value("${goong.key.map}")
    private String keyMap;

    private final WebClient goongWebClient;

    public Location getLocationFromAddress(String address) {
        return goongWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/Geocode")
                        .queryParam("address", address)
                        .queryParam("api_key", keyApi)
                        .build())
                .retrieve()
                .bodyToMono(GeocodeResponse.class)
                .map(response -> {
                    if (response.getResults() != null && !response.getResults().isEmpty()) {
                        return response.getResults().get(0).getGeometry().getLocation();
                    }
                    throw new RuntimeException("Không tìm thấy địa chỉ");
                })
                .block();
    }



}
