package com.flight.ticket.controller;

import com.flight.ticket.dto.BookingRequestDto;
import com.flight.ticket.dto.BookingResponseDto;
import com.flight.ticket.model.DatVe;
import com.flight.ticket.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> bookTicket(@RequestBody BookingRequestDto request) {
        try {
            System.out.println("\n\n=== Nhận request đặt vé ===");
            System.out.println("Mã người dùng từ Frontend: " + request.getMaNguoiDung());
            System.out.println("===============================\n\n");
            DatVe datVe = bookingService.bookTicket(request);
            BookingResponseDto response = BookingResponseDto.builder()
                    .message("Đặt vé thành công")
                    .maDatVe(datVe.getMaDatVe())
                    .maDatCho(datVe.getMaDatCho())
                    .trangThai(datVe.getTrangThai())
                    .build();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống trong quá trình đặt vé");
        }
    }
}
