package com.ntt.elogistics.repositories;

import com.ntt.elogistics.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    @Query("""
       SELECT p FROM Product p
       WHERE p.customerId = :customerId
         AND (
                :kw IS NULL
              OR CAST(p.id AS string) LIKE CONCAT('%', :kw, '%')
              OR LOWER(p.name) LIKE LOWER(CONCAT('%', :kw, '%'))
              OR LOWER(p.code) LIKE LOWER(CONCAT('%', :kw, '%'))
              OR LOWER(p.description) LIKE LOWER(CONCAT('%', :kw, '%'))
              OR CAST(p.quantity AS string) LIKE LOWER(CONCAT('%', :kw, '%'))
         )
       """)
    Page<Product> findAllByCustomerIdCustom(@Param("kw") String keyword,
                                            @Param("customerId") String customerId,
                                            Pageable pageable);

    boolean existsByCustomerIdAndCode(String customerId, String code);



}
