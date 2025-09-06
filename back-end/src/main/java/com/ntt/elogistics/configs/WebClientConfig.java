package com.ntt.elogistics.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Value("${goong.url.base}")
    private String baseUrl;

    @Bean
    public WebClient goongWebClient() {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }
}
