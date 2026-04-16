package com.flight.ticket.service;

import com.flight.ticket.dto.BookingRequestDto;
import com.flight.ticket.dto.PassengerDto;
import com.flight.ticket.model.*;
import com.flight.ticket.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.flight.ticket.dto.MyBookingDto;

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

    @Autowired
    private KhuyenMaiRepository khuyenMaiRepository;

    @Autowired
    private ThanhToanRepository thanhToanRepository;

    @Autowired
    private PhuongThucThanhToanRepository phuongThucThanhToanRepository;

    // MaPTTT = 4 tương ứng VNPAY trong bảng PHUONGTHUCTHANHTOAN
    private static final int MA_PTTT_VNPAY = 4;
    private static final int MA_PTTT_PAY_LATER = 6;

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

        // 3. Handle Promotion
        KhuyenMai khuyenMai = null;
        if (request.getMaKhuyenMai() != null && !request.getMaKhuyenMai().isEmpty()) {
            khuyenMai = khuyenMaiRepository.findByCode(request.getMaKhuyenMai())
                    .orElseThrow(() -> new RuntimeException("Mã khuyến mãi không hợp lệ."));
            
            // Check validity (date and quantity)
            java.time.LocalDate today = java.time.LocalDate.now(java.time.ZoneId.of("Asia/Ho_Chi_Minh"));
            if (today.isBefore(khuyenMai.getNgayBatDau()) || 
                today.isAfter(khuyenMai.getNgayKetThuc())) {
                throw new RuntimeException("Mã khuyến mãi đã hết hạn sử dụng.");
            }
            if (khuyenMai.getSoLuongConLai() <= 0) {
                throw new RuntimeException("Mã khuyến mãi đã hết lượt sử dụng.");
            }
        }

        // 4. Calculate Price & Process Passengers
        java.math.BigDecimal totalOriginalPrice = java.math.BigDecimal.ZERO;
        if (request.getPassengers() != null) {
            for (PassengerDto passenger : request.getPassengers()) {
                java.math.BigDecimal pgiaVe = passenger.getGiaVe() != null ? passenger.getGiaVe() : java.math.BigDecimal.ZERO;
                java.math.BigDecimal pgiaHl = passenger.getGiaHanhLy() != null ? passenger.getGiaHanhLy() : java.math.BigDecimal.ZERO;
                java.math.BigDecimal pgiaBh = passenger.getGiaBaoHiem() != null ? java.math.BigDecimal.valueOf(passenger.getGiaBaoHiem()) : java.math.BigDecimal.ZERO;
                
                totalOriginalPrice = totalOriginalPrice.add(pgiaVe).add(pgiaHl).add(pgiaBh);
            }
        }

        // Apply Discount
        java.math.BigDecimal discountAmount = java.math.BigDecimal.ZERO;
        if (khuyenMai != null) {
            discountAmount = totalOriginalPrice.multiply(khuyenMai.getPhanTramGiam()).divide(java.math.BigDecimal.valueOf(100));
            if (khuyenMai.getSoTienGiamToiDa() != null && discountAmount.compareTo(khuyenMai.getSoTienGiamToiDa()) > 0) {
                discountAmount = khuyenMai.getSoTienGiamToiDa();
            }
        }
        java.math.BigDecimal finalTotalPrice = totalOriginalPrice.subtract(discountAmount);

        // Optional: Compare with FE price to prevent tampering (allow minor rounding differences)
        if (request.getTongTien() != null && finalTotalPrice.subtract(request.getTongTien()).abs().compareTo(java.math.BigDecimal.valueOf(10)) > 0) {
            System.err.println("[SECURITY] Price mismatch! FE: " + request.getTongTien() + " calculated: " + finalTotalPrice);
            // In strict mode, throw exception. For now, we use calculated price.
        }

        // 5. Xác định trạng thái dựa theo phương thức thanh toán
        boolean isVnpay = "VNPAY".equalsIgnoreCase(request.getPhuongThucThanhToan());
        String bookingStatus = isVnpay ? "SUCCESS" : "PENDING";

        // 6. Create main booking record
        DatVe datVe = DatVe.builder()
                .maDatCho(pnr)
                .maNguoiDung(nguoiDung)
                .maKhuyenMai(khuyenMai)
                .ngayDatVe(LocalDateTime.now())
                .tongTien(finalTotalPrice)
                .trangThai(bookingStatus)
                .build();

        datVe = datVeRepository.save(datVe);

        // Update Promotion Usage count
        if (khuyenMai != null) {
            khuyenMai.setSoLuongConLai(khuyenMai.getSoLuongConLai() - 1);
            khuyenMaiRepository.save(khuyenMai);
        }

        // 7. Tạo bản ghi THANHTOAN
        int maPttt = isVnpay ? MA_PTTT_VNPAY : MA_PTTT_PAY_LATER;
        PhuongThucThanhToan pttt = phuongThucThanhToanRepository.findById(maPttt).orElse(null);
        ThanhToan thanhToan = ThanhToan.builder()
                .maDatVe(datVe)
                .maPTTT(pttt)
                .soTien(finalTotalPrice)
                .thoiGianThanhToan(LocalDateTime.now())
                .trangThai(isVnpay ? "SUCCESS" : "PENDING")
                .build();
        thanhToanRepository.save(thanhToan);
        System.out.println("[DEBUG Booking] Created THANHTOAN record for DatVe=" + datVe.getMaDatVe() + ", status=" + thanhToan.getTrangThai());

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
                        .giaBaoHiem(passenger.getGiaBaoHiem())
                        .build();

                ctDatVeRepository.save(ctDatVe);
            }
        }

        return datVe;
    }

    @Transactional(readOnly = true)
    public List<MyBookingDto> getBookingsByUser(int userId) {
        NguoiDung user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<DatVe> bookings = datVeRepository.findByMaNguoiDung(user);

        return bookings.stream().map(this::convertToMyBookingDto).collect(Collectors.toList());
    }

    private MyBookingDto convertToMyBookingDto(DatVe datVe) {
        return MyBookingDto.builder()
                .maDatVe(datVe.getMaDatVe())
                .maDatCho(datVe.getMaDatCho())
                .ngayDatVe(datVe.getNgayDatVe())
                .tongTien(datVe.getTongTien())
                .trangThai(datVe.getTrangThai())
                .tickets(datVeTickets(datVe))
                .build();
    }

    private List<MyBookingDto.MyTicketDto> datVeTickets(DatVe datVe) {
        List<CT_DatVe> tickets = ctDatVeRepository.findByMaDatVe(datVe);
        return tickets.stream().map(t -> MyBookingDto.MyTicketDto.builder()
                .maVe(t.getMaVe())
                .hoTenHK(t.getHoTenHK())
                .soGhe(t.getSoGhe())
                .giaVe(t.getGiaVe())
                .tenHangVe(t.getMaHangVe() != null ? t.getMaHangVe().getTenHangVe() : "N/A")
                .maChuyenBay(t.getMaChuyenBay() != null ? String.valueOf(t.getMaChuyenBay().getMaChuyenBay()) : "N/A")
                .noiDi(t.getMaChuyenBay() != null && t.getMaChuyenBay().getMaSanBayDi() != null ? 
                       t.getMaChuyenBay().getMaSanBayDi().getThanhPho() : "N/A")
                .noiDen(t.getMaChuyenBay() != null && t.getMaChuyenBay().getMaSanBayDen() != null ? 
                        t.getMaChuyenBay().getMaSanBayDen().getThanhPho() : "N/A")
                .thoiGianDi(t.getMaChuyenBay() != null ? t.getMaChuyenBay().getNgayGioKhoiHanh() : null)
                .thoiGianDen(t.getMaChuyenBay() != null ? t.getMaChuyenBay().getNgayGioHaCanh() : null)
                .build()).collect(Collectors.toList());

    }
}
