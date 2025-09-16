package com.ntt.elogistics.models;

import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.enums.BranchType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "t_branch")
public class Branch {
    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String province;
    @Column(nullable = false)
    private String district;
    @Column(nullable = false)
    private String ward;
    @Column(nullable = false)
    private String street;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BranchStatus status;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }

    @UpdateTimestamp
//    @Column(nullable = false)
    private LocalDateTime updateAt;

    @CreationTimestamp
//    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
