package com.ntt.elogistics.repositories;

import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.models.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BranchRepository extends JpaRepository<Branch, Long> {
    Branch findByProvinceAndDistrictAndWard(String province, String district, String ward);

    Branch findByProvinceAndDistrict(String province, String district);

    Branch findByProvince(String province);

    @Query("""
       SELECT b FROM Branch b
       WHERE b.status = :status
         AND (
              LOWER(b.name) LIKE LOWER(CONCAT('%', :kw, '%'))
              OR LOWER(b.province) LIKE LOWER(CONCAT('%', :kw, '%'))
              OR LOWER(b.district) LIKE LOWER(CONCAT('%', :kw, '%'))
              OR LOWER(b.ward) LIKE LOWER(CONCAT('%', :kw, '%'))
              OR LOWER(b.street) LIKE LOWER(CONCAT('%', :kw, '%'))
         )
       """)
    Page<Branch> searchBranches(@Param("kw") String keyword,@Param("status") BranchStatus status, Pageable pageable);

    long countByStatus(BranchStatus status);

}
