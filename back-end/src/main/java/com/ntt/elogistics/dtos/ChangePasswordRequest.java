package com.ntt.elogistics.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordRequest {
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min=8, message = "Mật khẩu phải có độ dài từ 8 kí tự trở lên")
    private String oldPassword;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min=8, message = "Mật khẩu phải có độ dài từ 8 kí tự trở lên")
    private String newPassword;
}
