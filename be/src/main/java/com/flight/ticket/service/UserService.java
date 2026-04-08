package com.flight.ticket.service;

import com.flight.ticket.dto.ChangePasswordRequest;
import com.flight.ticket.dto.UserDto;
import com.flight.ticket.dto.UserRequestDto;
import com.flight.ticket.model.NguoiDung;
import com.flight.ticket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDto updateProfile(int userId, UserRequestDto request) {
        NguoiDung user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getHoTen() != null) user.setHoTen(request.getHoTen());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getSdt() != null) user.setSdt(request.getSdt());
        if (request.getDiaChi() != null) user.setDiaChi(request.getDiaChi());
        if (request.getNgaySinh() != null) user.setNgaySinh(request.getNgaySinh());
        if (request.getGioiTinh() != null) user.setGioiTinh(request.getGioiTinh());
        if (request.getCccd() != null) user.setCccd(request.getCccd());

        userRepository.save(user);

        return UserDto.builder()
                .maNguoiDung(user.getMaNguoiDung())
                .email(user.getEmail())
                .hoTen(user.getHoTen())
                .role(user.getVaitro())
                .cccd(user.getCccd())
                .sdt(user.getSdt())
                .ngaySinh(user.getNgaySinh())
                .diaChi(user.getDiaChi())
                .gioiTinh(user.getGioiTinh())
                .build();
    }

    public UserDto getUserById(int userId) {
         NguoiDung user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
         
         return UserDto.builder()
                .maNguoiDung(user.getMaNguoiDung())
                .email(user.getEmail())
                .hoTen(user.getHoTen())
                .role(user.getVaitro())
                .cccd(user.getCccd())
                .sdt(user.getSdt())
                .ngaySinh(user.getNgaySinh())
                .diaChi(user.getDiaChi())
                .gioiTinh(user.getGioiTinh())
                .build();
    }

    public void changePassword(int userId, ChangePasswordRequest request) {
        NguoiDung user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getMatKhau())) {
            throw new RuntimeException("Mật khẩu hiện tại không chính xác");
        }

        user.setMatKhau(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
