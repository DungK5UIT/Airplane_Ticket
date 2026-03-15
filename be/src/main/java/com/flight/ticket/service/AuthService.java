package com.flight.ticket.service;

import com.flight.ticket.dto.AuthResponse;
import com.flight.ticket.dto.LoginRequest;
import com.flight.ticket.dto.RegisterRequest;
import com.flight.ticket.model.Role;
import com.flight.ticket.model.User;
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
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN") ? Role.ADMIN : Role.USER);

        String verificationCode = UUID.randomUUID().toString();
        user.setVerificationCode(verificationCode);

        userRepository.save(user);

        // Simulating email sending for verification
        emailService.sendVerificationEmail(user.getEmail(), verificationCode);

        return new AuthResponse(null, "User registered successfully! Please check your email for verification code.");
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email before logging in");
        }

        String jwt = jwtUtils.generateToken(user.getEmail());
        return new AuthResponse(jwt, "Login successful", user.getRole().toString());
    }

    public AuthResponse verifyEmail(String code) {
        Optional<User> userOpt = userRepository.findByVerificationCode(code);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid verification code");
        }

        User user = userOpt.get();
        user.setVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);

        return new AuthResponse(null, "Email verified successfully");
    }

    public AuthResponse forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String resetCode = UUID.randomUUID().toString();
            // Storing resetCode in verificationCode field for simplicity in this demo
            user.setVerificationCode(resetCode);
            userRepository.save(user);
            emailService.sendPasswordResetEmail(user.getEmail(), resetCode);
        }
        return new AuthResponse(null, "If the email is registered, a password reset link has been sent.");
    }
}
