package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.LoginRequest;
import com.ntt.elogistics.dtos.LoginResponse;
import com.ntt.elogistics.dtos.RegisterRequest;
import com.ntt.elogistics.enums.UserRole;
import com.ntt.elogistics.enums.UserStatus;
import com.ntt.elogistics.exceptions.CustomException;
import com.ntt.elogistics.exceptions.NotFoundUsernameException;
import com.ntt.elogistics.exceptions.UsernameAlreadyExistsException;
import com.ntt.elogistics.models.User;
import com.ntt.elogistics.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public void registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException();
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email đã được đăng ký",HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByPhone(request.getUsername())) {
            throw new CustomException("SĐT đã được đăng ký",HttpStatus.BAD_REQUEST);
        }

        User user = User
                .builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .role(UserRole.ROLE_CUSTOMER)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            LoginResponse response = jwtService.generateLoginResponse(authentication);
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow(NotFoundUsernameException::new);
            response.setUser(user);
            return response;

        } catch (BadCredentialsException e) {
            throw new CustomException("Tên đăng nhập hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED);
        } catch (AuthenticationException e) {
            throw new CustomException("Tài khoản đã bị khóa", HttpStatus.UNAUTHORIZED);
        }
    }
}
