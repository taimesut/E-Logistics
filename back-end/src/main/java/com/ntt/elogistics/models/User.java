package com.ntt.elogistics.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "t_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    private String branchWorkId;

    private String phone;

    private String avatar;

    private String province;
    private String district;
    private String ward;
    private String address;

    @Column(unique = true)
    private String email;
}
