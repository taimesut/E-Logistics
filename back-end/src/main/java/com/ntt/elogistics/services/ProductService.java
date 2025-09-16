package com.ntt.elogistics.services;

import com.ntt.elogistics.exceptions.CustomException;
import com.ntt.elogistics.exceptions.NotFoundUsernameException;
import com.ntt.elogistics.models.Product;
import com.ntt.elogistics.models.User;
import com.ntt.elogistics.repositories.ProductRepository;
import com.ntt.elogistics.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final FileUploadService fileUploadService;

    private User getUser(Authentication authentication){
        return userRepository.findByUsername(authentication.getName()).orElseThrow(NotFoundUsernameException::new);
    }

    public Page<Product> getProducts(int page,int size,String kw, Authentication authentication){
        User u = getUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by("updateAt").descending());

        return productRepository.findAllByCustomerIdCustom(kw,u.getId().toString(), pageable);
    }
    public Product getProduct(UUID id, Authentication authentication){
        Product p = productRepository.findById(id).orElseThrow(()->new CustomException("Không tìm thấy sản phẩm", HttpStatus.BAD_REQUEST));
        if(p.getCustomerId().equals(getUser(authentication).getId().toString())){
            return p;
        }
        throw new CustomException("Mã sản phẩm không hợp lệ", HttpStatus.BAD_REQUEST);
    }
    public void delete(UUID id, Authentication authentication){
        Product p = productRepository.findById(id).orElseThrow(()->new CustomException("Không tìm thấy sản phẩm", HttpStatus.BAD_REQUEST));
        if(p.getCustomerId().equals(getUser(authentication).getId().toString())){
            productRepository.delete(p);
            return;
        }
        throw new CustomException("Mã sản phẩm không hợp lệ", HttpStatus.BAD_REQUEST);
    }
    public Product createProduct(Product product, MultipartFile file, Authentication authentication){
        String customerId = getUser(authentication).getId().toString();
        if(productRepository.existsByCustomerIdAndCode(customerId, product.getCode())){
            throw new CustomException("Mã code đã tồn tại",HttpStatus.BAD_REQUEST);
        }

        String image = fileUploadService.uploadFile(file);
        Product p = Product.builder()
                .name(product.getName())
                .price(product.getPrice())
                .code(product.getCode())
                .description(product.getDescription())
                .weight(product.getWeight())
                .quantity(product.getQuantity())
                .image(image)
                .customerId(customerId)
                .build();
        return productRepository.save(p);
    }
    public Product updateProduct(UUID id, Product product, MultipartFile file, Authentication authentication){
        Product p = getProduct(id,authentication);
        String customerId = getUser(authentication).getId().toString();
        if(productRepository.existsByCustomerIdAndCode(customerId, product.getCode()) && !p.getCode().equals(product.getCode())){
            throw new CustomException("Mã code đã tồn tại",HttpStatus.BAD_REQUEST);
        }
        if(file!=null){
            String image = fileUploadService.uploadFile(file);
            p.setImage(image);
        }
        p.setCode(product.getCode());
        p.setName(product.getName());
        p.setDescription(product.getDescription());
        p.setQuantity(product.getQuantity());
        p.setPrice(product.getPrice());
        p.setWeight(product.getWeight());
        return productRepository.save(p);
    }
}
