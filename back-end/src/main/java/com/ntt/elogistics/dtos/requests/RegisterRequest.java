package com.ntt.elogistics.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Tên tài khoản không được để trống")
    @Size(min=8, message = "Tên tài khoản phải có độ dài từ 8 kí tự trở lên")
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min=8, message = "Mật khẩu phải có độ dài từ 8 kí tự trở lên")
    private String password;

    @NotBlank(message = "Họ và tên bắt buộc phải có")
    private String fullName;

    @Pattern(regexp = "\\d{10}", message = "SĐT không hợp lệ")
    private String phone;

    @Email(message = "Email không hợp lệ")
    private String email;
}
