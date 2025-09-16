package com.ntt.elogistics.services;

import com.ntt.elogistics.models.InforCustomer;
import com.ntt.elogistics.repositories.InforCustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InforCustomerService {
    private final InforCustomerRepository inforCustomerRepository;

    public List<InforCustomer> getAllByCustomerId(String customerId){
        return inforCustomerRepository.findByCustomerId(customerId);
    }
}
