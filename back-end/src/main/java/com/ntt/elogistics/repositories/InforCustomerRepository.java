package com.ntt.elogistics.repositories;

import com.ntt.elogistics.models.InforCustomer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InforCustomerRepository extends JpaRepository<InforCustomer, UUID> {
    List<InforCustomer> findByCustomerId(String customerId);

}
