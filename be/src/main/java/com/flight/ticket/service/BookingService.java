package com.flight.ticket.service;

import com.flight.ticket.dto.BookingRequestDto;
import com.flight.ticket.dto.PassengerDto;
import com.flight.ticket.model.*;
import com.flight.ticket.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private DatVeRepository datVeRepository;

    @Autowired
    private CT_DatVeRepository ctDatVeRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private FlightDetailRepository flightDetailRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public DatVe bookTicket(BookingRequestDto request) {
        // 1. Generate PNR
        String pnr = UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        // 2. Fetch User if provided
        NguoiDung nguoiDung = null;
        System.out.println("[DEBUG Booking] maNguoiDung from request: " + request.getMaNguoiDung());
        if (request.getMaNguoiDung() != null) {
            // Check if the user ID type matches (Integer)
            Integer userId = request.getMaNguoiDung();
            nguoiDung = userRepository.findById(userId).orElse(null);
            System.out.println("[DEBUG Booking] Fetched user from repo: " + (nguoiDung != null ? nguoiDung.getHoTen() : "NULL (not found in DB!)"));
        } else {
            System.out.println("[DEBUG Booking] maNguoiDung is NULL, skipping user lookup.");
        }

        // 3. Create main booking record
        DatVe datVe = DatVe.builder()
                .maDatCho(pnr)
                .maNguoiDung(nguoiDung)
                .ngayDatVe(LocalDateTime.now())
                .tongTien(request.getTongTien())
                .trangThai("PENDING")
                .build();
        
        datVe = datVeRepository.save(datVe);

        if (request.getPassengers() != null) {
            for (PassengerDto passenger : request.getPassengers()) {
                ChuyenBay chuyenBay = flightRepository.findById(passenger.getMaChuyenBay())
                        .orElseThrow(() -> new RuntimeException("Khoong tìm thấy chuyến bay: " + passenger.getMaChuyenBay()));

                CT_ChuyenBay.CT_ChuyenBayId ctId = new CT_ChuyenBay.CT_ChuyenBayId(chuyenBay.getMaChuyenBay(), passenger.getMaHangVe());
                CT_ChuyenBay ctChuyenBay = flightDetailRepository.findById(ctId)
                        .orElseThrow(() -> new RuntimeException("Khoong tìm thấy hạng vé!"));

                if (ctChuyenBay.getSoLuongConLai() <= 0) {
                    throw new RuntimeException("Hạng vé số " + passenger.getMaHangVe() + " trên chuyến bay " + passenger.getMaChuyenBay() + " đã hết chỗ.");
                }

                ctChuyenBay.setSoLuongConLai(ctChuyenBay.getSoLuongConLai() - 1);
                flightDetailRepository.save(ctChuyenBay);

                CT_DatVe ctDatVe = CT_DatVe.builder()
                        .maDatVe(datVe)
                        .maChuyenBay(chuyenBay)
                        .maHangVe(ctChuyenBay.getHangVe())
                        .hoTenHK(passenger.getHoTenHK())
                        .cccd(passenger.getCccd())
                        .ngaySinh(passenger.getNgaySinh())
                        .gioiTinh(passenger.getGioiTinh())
                        .doiTuong(passenger.getDoiTuong())
                        .soGhe(passenger.getSoGhe())
                        .giaVe(passenger.getGiaVe() != null ? passenger.getGiaVe() : java.math.BigDecimal.ZERO)
                        .giaHanhLy(passenger.getGiaHanhLy() != null ? passenger.getGiaHanhLy() : java.math.BigDecimal.ZERO)
                        .canNangHanhLy(passenger.getCanNangHanhLy())
                        .build();

                ctDatVeRepository.save(ctDatVe);
            }
        }

        return datVe;
    }
}
