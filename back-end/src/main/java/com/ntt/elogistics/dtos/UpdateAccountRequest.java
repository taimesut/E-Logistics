package com.ntt.elogistics.dtos;

import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.enums.UserStatus;
import com.ntt.elogistics.models.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAccountRequest {
    @NotBlank(message = "Tên tài khoản không được để trống")
    @Size(min=8, message = "Tên tài khoản phải có độ dài từ 8 kí tự trở lên")
    private String username;
    @NotBlank(message = "Họ và tên bắt buộc phải có")
    private String fullName;
    @Pattern(regexp = "\\d{10}", message = "SĐT không hợp lệ")
    private String phone;
    @Email(message = "Email không hợp lệ")
    private String email;
    private UserRole role;
    private UserStatus status;
    private String branchWorkId;

    public static User toModel(UpdateAccountRequest request){
        return User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .role(request.getRole())
                .status(request.getStatus())
                .branchWorkId(request.getBranchWorkId())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
    }
}
