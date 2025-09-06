package com.ntt.elogistics.services;

import com.ntt.elogistics.exceptions.CustomException;
import com.ntt.elogistics.models.PasswordResetToken;
import com.ntt.elogistics.models.User;
import com.ntt.elogistics.repositories.PasswordResetTokenRepository;
import com.ntt.elogistics.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${front-end.host}")
    private String host;

    public void createPasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("Email không tồn tại", HttpStatus.BAD_REQUEST));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUserId(user.getId().toString());
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));

        passwordResetTokenRepository.save(resetToken);

        String resetLink = host + "/reset-password?token=" + token;
        mailService.sendSimpleMail(user.getEmail(),"Reset Password", resetLink);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new CustomException("Token không hợp lệ", HttpStatus.BAD_REQUEST));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new CustomException("Token đã hết hạn", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findById(Integer.valueOf(String.valueOf(resetToken.getUserId()))) .orElseThrow(() -> new CustomException("Email không tồn tại", HttpStatus.BAD_REQUEST));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Xoá token sau khi dùng
        passwordResetTokenRepository.delete(resetToken);
    }
}
