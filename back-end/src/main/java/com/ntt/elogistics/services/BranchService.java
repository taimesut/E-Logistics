package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.BranchRequest;
import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.exceptions.CustomException;
import com.ntt.elogistics.models.Branch;
import com.ntt.elogistics.repositories.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BranchService {
    private final BranchRepository branchRepository;

    public Branch getById(UUID id){
        return branchRepository.findById(id)
                .orElseThrow(() -> new CustomException("Không tìm thấy chi nhánh", HttpStatus.BAD_REQUEST));
    }

    public Branch update(BranchRequest request, UUID id){
        Branch branch = getById(id);

        branch.setStatus(request.getStatus());
        branch.setName(request.getName());
        branch.setProvince(request.getProvince());
        branch.setDistrict(request.getDistrict());
        branch.setWard(request.getWard());
        branch.setStreet(request.getStreet());


        return branchRepository.save(branch);
    }

    public Branch create(BranchRequest request){
        return  branchRepository.save(BranchRequest.toModel(request));
    }

    public Page<Branch> getAll(int page, int size, String search, BranchStatus status){
        Pageable pageable = PageRequest.of(page, size, Sort.by("updateAt").descending());
        return branchRepository.getAllCustom(search,status,pageable);
    }

}
