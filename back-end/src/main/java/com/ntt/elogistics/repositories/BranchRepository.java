package com.ntt.elogistics.repositories;

import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.models.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface BranchRepository extends JpaRepository<Branch, UUID> {
    Branch findByProvinceAndDistrictAndWard(String province, String district, String ward);

    Branch findByProvinceAndDistrict(String province, String district);

    Branch findByProvince(String province);

    @Query("""
       SELECT b FROM Branch b
       WHERE (:status IS NULL OR b.status = :status)
         AND (
              :kw IS NULL
              OR CAST(b.id AS string) LIKE CONCAT('%', :kw, '%')
              OR LOWER(b.name) LIKE LOWER(CONCAT('%', :kw, '%'))
              OR LOWER(b.province) LIKE LOWER(CONCAT('%', :kw, '%'))
              OR LOWER(b.district) LIKE LOWER(CONCAT('%', :kw, '%'))
              OR LOWER(b.ward) LIKE LOWER(CONCAT('%', :kw, '%'))
              OR LOWER(b.street) LIKE LOWER(CONCAT('%', :kw, '%'))
         )
       """)
    Page<Branch> getAllCustom(@Param("kw") String keyword, @Param("status") BranchStatus status, Pageable pageable);


    @Query("SELECT COUNT(u) FROM Branch u WHERE u.status = :status")
    long countByStatus(@Param("status") BranchStatus status);
}
