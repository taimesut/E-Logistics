package com.ntt.elogistics.models;

import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.enums.BranchType;
import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "t_branch")
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String province;
    private String district;
    private String ward;
    private String street;

    @Enumerated(EnumType.STRING)
    private BranchStatus status;

    @Enumerated(EnumType.STRING)
    private BranchType type;
}
