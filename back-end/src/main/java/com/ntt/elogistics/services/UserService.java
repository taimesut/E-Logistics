package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.requests.ChangePasswordRequest;
import com.ntt.elogistics.dtos.requests.CreateAccountRequest;
import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.enums.UserStatus;
import com.ntt.elogistics.exceptions.CustomException;
import com.ntt.elogistics.exceptions.NotFoundUsernameException;
import com.ntt.elogistics.exceptions.UsernameAlreadyExistsException;
import com.ntt.elogistics.models.User;
import com.ntt.elogistics.repositories.ParcelRepository;
import com.ntt.elogistics.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ParcelRepository parcelRepository;
    private final FileUploadService fileUploadService;

    public User getProfileByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(NotFoundUsernameException::new);
    }

    public Page<User> adminGetAccounts(int page, int size, String search, UserRole role) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        if(role!=null){
            return userRepository.searchByRoleAndName(role,search, pageable);
        }
        return userRepository.searchByName(search,pageable);
    }

    public User adminCreateAccount(CreateAccountRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException();
        }

        User u = CreateAccountRequest.toModel(request);
        u.setPassword(passwordEncoder.encode(request.getPassword()));
        return userRepository.save(u);
    }

    public User adminGetAccountById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new CustomException("Không tìm thấy user: " + id, HttpStatus.BAD_REQUEST));
    }

    public String getUserIdToStringFromAuthentication(Authentication authentication) {
        return userRepository.findIdByUsername(authentication.getName())
                .orElseThrow(NotFoundUsernameException::new)
                .toString();
    }

    public User adminUpdateAccount(CreateAccountRequest request, Integer id) {
        User u = adminGetAccountById(id);

        u.setFullName(request.getFullName());
        u.setStatus(request.getStatus());
        u.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(u);
    }

    public String getBranchIdByUsername(String username) {
        return userRepository.findBranchWorkIdByUsername(username);
    }

    public List<User> managerGetShippers(Authentication authentication) {
        String branchWorkId = userRepository.findBranchWorkIdByUsername(authentication.getName());
        return userRepository.findByBranchWorkIdAndRoleAndStatus(branchWorkId, UserRole.ROLE_SHIPPER, UserStatus.ACTIVE);
    }
    public User managerGetShipper(Long id, Authentication authentication){
        User shipper = userRepository.findById(id.intValue())
                .orElseThrow(() -> new CustomException("Không tìm thấy user: " + id, HttpStatus.BAD_REQUEST));
        if(shipper.getBranchWorkId().equals(getBranchIdByUsername(authentication.getName()))){
            return shipper;
        }
        throw new CustomException("Khoong phu hop",HttpStatus.BAD_REQUEST);
    }

    public User customerGetShipper(Long id, Authentication authentication){
        User shipper = userRepository.findById(id.intValue())
                .orElseThrow(() -> new CustomException("Không tìm thấy user: " + id, HttpStatus.BAD_REQUEST));
        if(parcelRepository.existsByUserIdAndPickupShipperId(getUserIdToStringFromAuthentication(authentication), id.toString())
                || parcelRepository.existsByUserIdAndDeliveryShipperId(getUserIdToStringFromAuthentication(authentication), id.toString())){
            return shipper;
        }
        throw new CustomException("Khoong phu hop",HttpStatus.BAD_REQUEST);
    }

    public void ChangePassword(ChangePasswordRequest request, Authentication authentication){
        String userId = getUserIdToStringFromAuthentication(authentication);

        User u = userRepository.findById(Integer.valueOf(userId))
                .orElseThrow(() -> new CustomException("Không tìm thấy user", HttpStatus.BAD_REQUEST));

        if(!passwordEncoder.matches(request.getOldPassword(), u.getPassword())){
            throw new CustomException("Mật khẩu cũ không chính xác",HttpStatus.BAD_REQUEST);
        }

        u.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(u);
    }

    public User uploadAvatar(MultipartFile file, Authentication authentication){
        User u = getProfileByUsername(authentication.getName());

        String url = fileUploadService.uploadFile(file);

        u.setAvatar(url);

        return userRepository.save(u);
    }

    public User updateAddress(String province, String district, String ward, String address, Authentication authentication){
        User u = getProfileByUsername(authentication.getName());

        u.setAddress(address);
        u.setWard(ward);
        u.setDistrict(district);
        u.setProvince(province);

        return userRepository.save(u);
    }

    public long adminCountByRole(UserRole role){
        return userRepository.countByRole(role);
    }

}
