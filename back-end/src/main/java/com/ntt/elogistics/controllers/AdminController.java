package com.ntt.elogistics.controllers;

import com.ntt.elogistics.dtos.requests.BranchRequest;
import com.ntt.elogistics.dtos.requests.CreateAccountRequest;
import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.helpers.ApiResponseFactory;
import com.ntt.elogistics.models.Branch;
import com.ntt.elogistics.models.ShippingRule;
import com.ntt.elogistics.models.User;
import com.ntt.elogistics.repositories.ShippingRuleRepository;
import com.ntt.elogistics.services.BranchService;
import com.ntt.elogistics.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {
    private final BranchService branchService;
    private final UserService userService;

    private final ShippingRuleRepository shippingRuleRepository;
    //region branch

    @PostMapping("/branch")
    public ResponseEntity<?> createBranch(@RequestBody BranchRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("createBranch", branchService.adminCreateBranch(request)));
    }

    @PutMapping("/branch/{id}")
    public ResponseEntity<?> updateBranch(@RequestBody BranchRequest request, @PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("updateBranch", branchService.adminUpdateBranch(request, id)));
    }

    @GetMapping("/branch")
    public ResponseEntity<?> getBranches(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size,
                                         @RequestParam BranchStatus status,
                                         @RequestParam(defaultValue = "") String search) {

        Page<Branch> branchPage = branchService.adminGetBranches(page, size, search,status);

        Map<String, Object> response = new HashMap<>();
        response.put("data", branchPage.getContent());
        response.put("currentPage", branchPage.getNumber());
        response.put("totalItems", branchPage.getTotalElements());
        response.put("totalPages", branchPage.getTotalPages());

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getBranches", response));
    }

    @GetMapping("/branch/{id}")
    public ResponseEntity<?> getBranch(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getBranch", branchService.adminGetBranchById(id)));
    }

    //endregion

    // region account
    @GetMapping("/account")
    public ResponseEntity<?> getAccounts(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size,
                                       @RequestParam(required = false) UserRole role,
                                       @RequestParam(defaultValue = "") String search) {
        Page<User> userPage = userService.adminGetAccounts(page, size, search,role);

        Map<String, Object> response = new HashMap<>();
        response.put("data", userPage.getContent());
        response.put("currentPage", userPage.getNumber());
        response.put("totalItems", userPage.getTotalElements());
        response.put("totalPages", userPage.getTotalPages());

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getAccounts", response));
    }

    @PostMapping("/account")
    public ResponseEntity<?> createAccount(@RequestBody CreateAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("createAccount", userService.adminCreateAccount(request)));
    }

    @PutMapping("/account/{id}")
    public ResponseEntity<?> updateAccount(@RequestBody CreateAccountRequest request, @PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("updateAccount", userService.adminUpdateAccount(request, id)));
    }

    @GetMapping("/account/{id}")
    public ResponseEntity<?> getAccount(@PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getAccount", userService.adminGetAccountById(id)));
    }
    // endregion

    @GetMapping("/shipping-rule")
    public ResponseEntity<?> getShippingRule(){
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getShippingRule", shippingRuleRepository.findAll()));
    }

    @PostMapping("/shipping-rule")
    public ResponseEntity<?> setShippingRule(@RequestBody List<ShippingRule> rules){
        shippingRuleRepository.deleteAll();
        rules.forEach(r -> r.setId(null));
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getShippingRule", shippingRuleRepository.saveAll(rules)));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(){
        Map<String, Object> response = new HashMap<>();
        response.put("MANAGER", userService.adminCountByRole(UserRole.ROLE_MANAGER));
        response.put("SHIPPER", userService.adminCountByRole(UserRole.ROLE_SHIPPER));
        response.put("CUSTOMER", userService.adminCountByRole(UserRole.ROLE_CUSTOMER));
        response.put("BRANCH_ACTIVE", branchService.adminCountByStatus(BranchStatus.ACTIVE));
        response.put("BRANCH_INACTIVE", branchService.adminCountByStatus(BranchStatus.INACTIVE));
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getShippingRule", response));
    }
}
