package com.ntt.elogistics.inits;

import com.ntt.elogistics.dtos.requests.RegisterRequest;
import com.ntt.elogistics.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AuthService authService;

    @Override
    public void run(String... args) {
        registerUser();

    }



    private void registerUser(){
//        System.out.println("========================= Thêm users ");
//        authService.registerUser(RegisterRequest
//                .builder()
//                .username("stringst")
//                .password("stringst")
//                .fullName("Nguyen Thanh Tai")
//                .build());
//        authService.createManage("manage123");
//        System.out.println("========================= Thêm users thành công");
    }

}

