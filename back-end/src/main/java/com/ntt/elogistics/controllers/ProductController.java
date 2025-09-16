package com.ntt.elogistics.controllers;

import com.ntt.elogistics.enums.BranchStatus;
import com.ntt.elogistics.helpers.ApiResponseFactory;
import com.ntt.elogistics.models.Branch;
import com.ntt.elogistics.models.Product;
import com.ntt.elogistics.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
@PreAuthorize("hasRole('CUSTOMER')")
public class ProductController {
    private final ProductService productService;

    @GetMapping("")
    public ResponseEntity<?> getProducts(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size,
                                         @RequestParam(defaultValue = "") String search,
                                         Authentication authentication) {
        Page<Product> productPage = productService.getProducts(page, size, search, authentication);

        Map<String, Object> response = new HashMap<>();
        response.put("data", productPage.getContent());
        response.put("currentPage", productPage.getNumber());
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getProducts", response));
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getProduct(@PathVariable UUID id, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponseFactory.success("getProducts", productService.getProduct(id,authentication)));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable UUID id, Authentication authentication) {
        productService.delete(id,authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("createProduct", null));
    }

    @PutMapping(value = "{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateProduct(@PathVariable UUID id, @RequestPart("product") Product product, @RequestPart(required = false, name = "file") MultipartFile file, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("updateProduct", productService.updateProduct(id,product,file,authentication)));
    }

    @PostMapping(value = "", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createProduct(@RequestPart("product") Product product, @RequestPart("file") MultipartFile file, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseFactory.created("createProduct", productService.createProduct(product,file,authentication)));
    }
}
