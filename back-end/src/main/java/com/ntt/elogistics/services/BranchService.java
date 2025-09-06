package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.requests.BranchRequest;
import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.enums.BranchType;
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

@Service
@RequiredArgsConstructor
public class BranchService {
    private final BranchRepository branchRepository;

    public Branch adminGetBranchById(Long id){
        return branchRepository.findById(id)
                .orElseThrow(() -> new CustomException("Branch not found with id: " + id, HttpStatus.BAD_REQUEST));
    }

    public Branch adminUpdateBranch(BranchRequest request, Long id){
        Branch branch = adminGetBranchById(id);

        branch.setStatus(request.getStatus());
        branch.setName(request.getName());
        branch.setProvince(request.getProvince());
        branch.setDistrict(request.getDistrict());
        branch.setWard(request.getWard());
        branch.setStreet(request.getStreet());
        branch.setType(BranchType.POST_OFFICE);

        return branchRepository.save(branch);
    }

    public Branch adminCreateBranch(BranchRequest request){
        return  branchRepository.save(BranchRequest.toModel(request));
    }

    public Page<Branch> adminGetBranches(int page, int size, String search,BranchStatus status){
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return branchRepository.searchBranches(search,status,pageable);
    }

    public long adminCountByStatus(BranchStatus status){
        return branchRepository.countByStatus(status);
    }
}
