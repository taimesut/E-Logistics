package com.ntt.elogistics.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @NotBlank(message = "username is required")
    @Size(min=8, message = "username must be at least 8 characters")
    private String username;

    @NotBlank(message = "password is required")
    @Size(min=8, message = "password must be at least 8 characters")
    private String password;
}
