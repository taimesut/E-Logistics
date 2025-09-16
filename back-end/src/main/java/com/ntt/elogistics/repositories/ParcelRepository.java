package com.ntt.elogistics.repositories;

import com.ntt.elogistics.dtos.ParcelStatusCountDto;
import com.ntt.elogistics.enums.ParcelStatus;
import com.ntt.elogistics.models.Parcel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ParcelRepository extends JpaRepository<Parcel, UUID> {

    @Query("""
            SELECT p FROM Parcel p
            WHERE
            (
                p.userId = :userId OR
                p.toBranchId = :branchId OR
                p.fromBranchId = :branchId OR
                p.pickupShipperId = :userId OR
                p.deliveryShipperId = :userId
            )
            AND (:status IS NULL OR p.status = :status)
            AND (
            :search IS NULL OR
            :search = '' OR
             CAST(p.id AS string) LIKE CONCAT('%', :search, '%') OR
             LOWER(p.toPhone) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(p.toName) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(p.fromPhone) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(p.fromName) LIKE LOWER(CONCAT('%', :search, '%'))
            )
            """)
    Page<Parcel> findAllCustom(@Param("userId") String userId,
                               @Param("branchId") String branchId,
                               @Param("search") String search,
                               @Param("status") ParcelStatus status,
                               Pageable pageable);


    @Query("SELECT p.status AS status, COUNT(p) AS count " +
            "FROM Parcel p " +
            "WHERE p.userId = :userId " +
            "GROUP BY p.status")
    List<Object[]> dashboardCustomer(@Param("userId") String userId);


    @Query("SELECT p.status AS status, COUNT(p) AS count " +
            "FROM Parcel p " +
            "WHERE p.pickupShipperId = :shipperId AND p.status IN :listStatus " +
            "GROUP BY p.status")
    List<Object[]> dashboardShipperPickup(@Param("shipperId") String shipperId,
                                          @Param("listStatus") List<ParcelStatus> listStatus);

    @Query("SELECT p.status AS status, COUNT(p) AS count " +
            "FROM Parcel p " +
            "WHERE p.deliveryShipperId = :shipperId AND p.status IN :listStatus " +
            "GROUP BY p.status")
    List<Object[]> dashboardShipperDelivery(@Param("shipperId") String shipperId,
                                          @Param("listStatus") List<ParcelStatus> listStatus);

    @Query("SELECT p.status AS status, COUNT(p) AS count " +
            "FROM Parcel p " +
            "WHERE p.fromBranchId = :branchId AND p.status IN :listStatus " +
            "GROUP BY p.status")
    List<Object[]> dashboardManagerPickup(@Param("branchId") String branchId,
                                          @Param("listStatus") List<ParcelStatus> listStatus);

    @Query("SELECT p.status AS status, COUNT(p) AS count " +
            "FROM Parcel p " +
            "WHERE p.toBranchId = :branchId AND p.status IN :listStatus " +
            "GROUP BY p.status")
    List<Object[]> dashboardManagerDelivery(@Param("branchId") String branchId,
                                          @Param("listStatus") List<ParcelStatus> listStatus);



    @Query(value = """
        SELECT p.id AS productId,
            p.name AS productName,
            SUM(pp.quantity) AS totalQuantity,
            SUM(pp.quantity * pp.price) AS totalRevenue
        FROM t_parcel pa
        JOIN t_product_parcel pp ON CAST(pa.id AS text) = pp.parcel_id
        JOIN t_product p ON pp.product_id = CAST(p.id AS text)
        WHERE pa.user_id = :customerId
          AND pa.status = 'DELIVERED'
          AND pa.created_at BETWEEN :startDate AND :endDate
        GROUP BY p.id, p.name
        ORDER BY totalRevenue DESC
        """, nativeQuery = true)
    List<Object[]> statsCustomer(
            @Param("customerId") String customerId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
