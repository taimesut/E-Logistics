package com.ntt.elogistics.controllers;

import com.ntt.elogistics.dtos.BranchRequest;
import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.helpers.ApiResponseFactory;
import com.ntt.elogistics.models.Branch;
import com.ntt.elogistics.services.BranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/branch")
@PreAuthorize("hasRole('ADMIN')")
public class BranchController {
    private final BranchService branchService;

    @PostMapping("")
    public ResponseEntity<?> createBranch(@RequestBody BranchRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("createBranch", branchService.create(request)));
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateBranch(@RequestBody BranchRequest request, @PathVariable UUID id) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("updateBranch", branchService.update(request, id)));
    }

    @GetMapping("")
    public ResponseEntity<?> getBranches(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size,
                                         @RequestParam(required = false) BranchStatus status,
                                         @RequestParam(defaultValue = "") String search) {

        Page<Branch> branchPage = branchService.getAll(page, size, search, status);

        Map<String, Object> response = new HashMap<>();
        response.put("data", branchPage.getContent());
        response.put("currentPage", branchPage.getNumber());
        response.put("totalItems", branchPage.getTotalElements());
        response.put("totalPages", branchPage.getTotalPages());

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getBranches", response));
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getBranch(@PathVariable UUID id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getBranch", branchService.getById(id)));
    }
}
