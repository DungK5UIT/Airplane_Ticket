package com.flight.ticket.service;

import com.flight.ticket.dto.AuthResponse;
import com.flight.ticket.dto.LoginRequest;
import com.flight.ticket.dto.RegisterRequest;
import com.flight.ticket.dto.UserDto;
import com.flight.ticket.model.NguoiDung;
import com.flight.ticket.repository.UserRepository;
import com.flight.ticket.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email da duoc su dung");
        }

        NguoiDung user = new NguoiDung();
        user.setHoTen(request.getName());
        user.setEmail(request.getEmail());
        user.setMatKhau(passwordEncoder.encode(request.getPassword()));
        user.setVaitro(
                request.getRole() != null && !request.getRole().isBlank()
                        ? request.getRole().toUpperCase()
                        : "USER"
        );
        user.setVerified(false);

        String verificationCode = UUID.randomUUID().toString();
        user.setVerificationCode(verificationCode);

        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), verificationCode);

        return AuthResponse.builder()
                .message("Dang ky thanh cong. Vui long kiem tra email de xac thuc.")
                .role(user.getVaitro())
                .user(UserDto.builder()
                        .maNguoiDung(user.getMaNguoiDung())
                        .email(user.getEmail())
                        .hoTen(user.getHoTen())
                        .role(user.getVaitro())
                        .build())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Optional<NguoiDung> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Email hoac mat khau khong dung");
        }

        NguoiDung user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getMatKhau())) {
            throw new RuntimeException("Email hoac mat khau khong dung");
        }

        if (!user.isVerified()) {
            throw new RuntimeException("Vui long xac thuc email truoc khi dang nhap");
        }

        String jwt = jwtUtils.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(jwt)
                .message("Dang nhap thanh cong")
                .role(user.getVaitro())
                .user(UserDto.builder()
                        .maNguoiDung(user.getMaNguoiDung())
                        .email(user.getEmail())
                        .hoTen(user.getHoTen())
                        .role(user.getVaitro())
                        .build())
                .build();
    }

    public AuthResponse verifyEmail(String code) {
        Optional<NguoiDung> userOpt = userRepository.findByVerificationCode(code);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Ma xac thuc khong hop le");
        }

        NguoiDung user = userOpt.get();
        user.setVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);

        return AuthResponse.builder()
                .message("Xac thuc email thanh cong")
                .role(user.getVaitro())
                .user(UserDto.builder()
                        .maNguoiDung(user.getMaNguoiDung())
                        .email(user.getEmail())
                        .hoTen(user.getHoTen())
                        .role(user.getVaitro())
                        .build())
                .build();
    }

    public AuthResponse forgotPassword(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email khong duoc de trong");
        }
        Optional<NguoiDung> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            NguoiDung user = userOpt.get();
            // Generate a random 8-character password
            String newPassword = UUID.randomUUID().toString().substring(0, 8);
            System.out.println("Gửi mật khẩu mới cho user: " + newPassword);
            
            // Hash the new password before storing it into the database
            user.setMatKhau(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            
            // Send the plain text completely unhashed new password via email
            emailService.sendPasswordResetEmail(user.getEmail(), newPassword);
        }
        return AuthResponse.builder()
                .message("Neu email ton tai, he thong da gui mat khau moi den email cua ban.")
                .build();
    }
}
