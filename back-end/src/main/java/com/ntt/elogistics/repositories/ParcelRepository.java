package com.ntt.elogistics.repositories;

import com.ntt.elogistics.enums.ParcelStatus;
import com.ntt.elogistics.models.Parcel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParcelRepository extends JpaRepository<Parcel, Long> {

    @Query("""
            SELECT p FROM Parcel p
            WHERE p.userId = :userId
              AND (
                   LOWER(p.toPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.toName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromName) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Parcel> findByUserId(@Param("userId") String userId,
                              @Param("search") String search,
                              Pageable pageable);


    @Query("""
                    SELECT p FROM Parcel p WHERE p.userId = :userId AND p.status = :status
                    AND (
                   LOWER(p.toPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.toName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromName) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Parcel> findByUserIdAndStatus(@Param("userId") String userId,
                                       @Param("status") ParcelStatus status,
                                       @Param("search") String search,
                                       Pageable pageable);

    @Query("""
            SELECT p FROM Parcel p WHERE p.fromBranchId = :fromBranchId
            AND (
                   LOWER(p.toPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.toName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromName) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Parcel> findByFromBranchId(@Param("fromBranchId") String fromBranchId,
                                    @Param("search") String search,
                                    Pageable pageable);

    @Query("""
            SELECT p FROM Parcel p WHERE p.toBranchId = :toBranchId
            AND (
                   LOWER(p.toPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.toName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromName) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Parcel> findByToBranchId(@Param("toBranchId") String toBranchId,
                                  @Param("search") String search,
                                  Pageable pageable);

    //-------------------------------------------------------
    //manager
    //pick up
    @Query("""
            SELECT p FROM Parcel p WHERE p.fromBranchId = :fromBranchId AND p.status = :status
            AND (
                   LOWER(p.toPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.toName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromName) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Parcel> findByFromBranchIdAndStatus(@Param("fromBranchId") String fromBranchId,
                                             @Param("status") ParcelStatus status,
                                             @Param("search") String search,
                                             Pageable pageable);

    @Query("""
            SELECT p FROM Parcel p WHERE p.toBranchId = :toBranchId AND p.status = :status
            AND (
                   LOWER(p.toPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.toName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromName) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Parcel> findByToBranchIdAndStatus(@Param("toBranchId") String toBranchId,
                                           @Param("status") ParcelStatus status,
                                           @Param("search") String search,
                                           Pageable pageable);

    //-------------------------------------------------------
    //shipper
    //pickup
    @Query("""
            SELECT p FROM Parcel p WHERE p.pickupShipperId = :shipperId AND p.status = :status
            AND (
                           LOWER(p.toPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(p.toName) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(p.fromPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(p.fromName) LIKE LOWER(CONCAT('%', :search, '%'))
                      )
            """)
    Page<Parcel> findByPickupShipperIdAndStatus(@Param("shipperId") String shipperId,
                                                @Param("status") ParcelStatus status,
                                                @Param("search") String search,
                                                Pageable pageable);

    @Query("""
            SELECT p FROM Parcel p WHERE p.pickupShipperId = :shipperId
            AND (
                           LOWER(p.toPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(p.toName) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(p.fromPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                        OR LOWER(p.fromName) LIKE LOWER(CONCAT('%', :search, '%'))
                      )
            """)
    Page<Parcel> findByPickupShipperId(@Param("shipperId") String shipperId,
                                       @Param("search") String search,
                                       Pageable pageable);

    //delivery
    @Query("""
            SELECT p FROM Parcel p WHERE p.deliveryShipperId = :shipperId AND p.status = :status
            AND (
                   LOWER(p.toPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.toName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromName) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Parcel> findByDeliveryShipperIdAndStatus(@Param("shipperId") String shipperId,
                                                  @Param("status") ParcelStatus status,
                                                  @Param("search") String search,
                                                  Pageable pageable);


    @Query("""
            SELECT p FROM Parcel p WHERE p.deliveryShipperId = :shipperId
            AND (
                   LOWER(p.toPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.toName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.fromName) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<Parcel> findByDeliveryShipperId(@Param("shipperId") String shipperId,
                                         @Param("search") String search,
                                         Pageable pageable);

    boolean existsByUserIdAndPickupShipperId(String userId, String shipperId);

    boolean existsByUserIdAndDeliveryShipperId(String userId, String shipperId);

    @Query("SELECT p.status, COUNT(p) " +
            "FROM Parcel p " +
            "WHERE p.fromBranchId = :branchId OR p.toBranchId = :branchId " +
            "GROUP BY p.status")
    List<Object[]> countByStatusFromOrToBranch(@Param("branchId") String branchId);

    @Query("SELECT p.status, COUNT(p) " +
            "FROM Parcel p " +
            "WHERE p.pickupShipperId = :shipperId OR p.deliveryShipperId = :shipperId " +
            "GROUP BY p.status")
    List<Object[]> countByStatusPickupOrDeliveryShipperId(@Param("shipperId") String branchId);

    @Query("SELECT COUNT(p) FROM Parcel p WHERE p.userId = :userId AND p.status = :status")
    long countParcelsByUserIdAndStatus(@Param("userId") String userId,
                                     @Param("status") ParcelStatus status);

    @Query("SELECT COUNT(p) FROM Parcel p WHERE p.userId = :userId")
    long countByUserId(@Param("userId") String userId);

    @Query("SELECT p.status, COUNT(p) FROM Parcel p WHERE p.userId = :userId GROUP BY p.status")
    List<Object[]> countByStatus(@Param("userId") String userId);

    @Query("SELECT COALESCE(SUM(p.shippingFee), 0) FROM Parcel p WHERE p.userId = :userId")
    double totalShippingFee(@Param("userId") String userId);

    @Query("SELECT COUNT(p) FROM Parcel p WHERE p.pickupShipperId = :shipperId OR p.deliveryShipperId = :shipperId")
    long countByShipper(@Param("shipperId") String shipperId);

    @Query("SELECT p.status, COUNT(p) FROM Parcel p " +
            "WHERE p.pickupShipperId = :shipperId OR p.deliveryShipperId = :shipperId " +
            "GROUP BY p.status")
    List<Object[]> countByStatusForShipper(@Param("shipperId") String shipperId);


    @Query("SELECT COUNT(p) FROM Parcel p WHERE p.fromBranchId = :branchId OR p.toBranchId = :branchId")
    long countByBranch(@Param("branchId") String branchId);

    @Query("SELECT p.status, COUNT(p), SUM(p.shippingFee) FROM Parcel p " +
            "WHERE p.fromBranchId = :branchId OR p.toBranchId = :branchId " +
            "GROUP BY p.status")
    List<Object[]> countByStatusForBranch(@Param("branchId") String branchId);

    @Query("SELECT COALESCE(SUM(p.shippingFee), 0) FROM Parcel p WHERE p.fromBranchId = :branchId OR p.toBranchId = :branchId")
    double totalRevenue(@Param("branchId") String branchId);


    @Query("SELECT COUNT(p) FROM Parcel p")
    long totalParcels();

    @Query("SELECT p.status, COUNT(p) FROM Parcel p GROUP BY p.status")
    List<Object[]> countParcelsByStatus();

    @Query("SELECT COALESCE(SUM(p.shippingFee), 0) FROM Parcel p")
    double totalRevenue();
}
