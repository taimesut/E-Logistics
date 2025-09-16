package com.ntt.elogistics.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

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
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    private String branchWorkId;

    @Column(unique = true, nullable = false)
    private String phone;

    private String avatar;

    private String province;
    private String district;
    private String ward;
    private String address;

    @Column(unique = true, nullable = false)
    private String email;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updateAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
