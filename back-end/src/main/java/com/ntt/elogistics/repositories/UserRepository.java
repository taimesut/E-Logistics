package com.ntt.elogistics.repositories;

import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.enums.UserStatus;
import com.ntt.elogistics.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {


    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByPhone(String phone);

    Boolean existsByEmail(String email);

    @Query("SELECT u.id FROM User u WHERE u.username = :username")
    Optional<Integer> findIdByUsername(@Param("username") String username);

    @Query("SELECT u.branchWorkId FROM User u WHERE u.username = :username")
    String findBranchWorkIdByUsername(@Param("username") String username);

    List<User> findByBranchWorkIdAndRoleAndStatus(String branchWorkId, UserRole role, UserStatus status);

    Optional<User> findByEmail(String email);

    @Query("""
            SELECT u FROM User u
            WHERE
            (
                    :kw IS NULL OR
                     CAST(u.id AS string) LIKE CONCAT('%', :kw, '%') OR
                     LOWER(u.branchWorkId) LIKE LOWER(CONCAT('%', :kw, '%')) OR
                   LOWER(u.username) LIKE LOWER(CONCAT('%', :kw, '%')) OR
                    LOWER(u.fullName) LIKE LOWER(CONCAT('%', :kw, '%'))
              )
              AND (
                :role IS NULL OR u.role = :role
              )
              AND (:status IS NULL OR u.status = :status)
            """)
    Page<User> getAllCustom(@Param("role") UserRole role,
            @Param("kw") String keyword,
                            @Param("status") UserStatus status,
            Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") UserRole role);

}
