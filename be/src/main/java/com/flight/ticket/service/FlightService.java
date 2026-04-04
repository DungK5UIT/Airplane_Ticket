package com.flight.ticket.service;

import com.flight.ticket.dto.FlightDto;
import com.flight.ticket.model.CT_ChuyenBay;
import com.flight.ticket.model.ChuyenBay;
import com.flight.ticket.repository.FlightDetailRepository;
import com.flight.ticket.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private FlightDetailRepository ctChuyenBayRepository;

    public FlightDto mapToDto(ChuyenBay cb) {
        FlightDto dto = FlightDto.builder()
                .maChuyenBay(cb.getMaChuyenBay())
                .maHangHK(cb.getMaHangHK())
                .maMayBay(cb.getMaMayBay())
                .maSanBayDi(cb.getMaSanBayDi())
                .maSanBayDen(cb.getMaSanBayDen())
                .ngayGioKhoiHanh(cb.getNgayGioKhoiHanh())
                .ngayGioHaCanh(cb.getNgayGioHaCanh())
                .thoiGianBay(cb.getThoiGianBay())
                .trangThai(cb.getTrangThai())
                .build();

        List<CT_ChuyenBay> ctList = ctChuyenBayRepository.findByChuyenBay(cb);

        int totalSoLuongCho = 0;
        int totalSoLuongChoConLai = 0;
        java.util.List<com.flight.ticket.dto.FlightClassDetailDto> classDetails = new java.util.ArrayList<>();

        if (ctList != null && !ctList.isEmpty()) {
            for (CT_ChuyenBay ct : ctList) {
                if (ct.getHangVe() == null)
                    continue;

                totalSoLuongCho += ct.getSoLuongCho();
                totalSoLuongChoConLai += ct.getSoLuongConLai();

                double basePrice = ct.getGiaCoBan();
                double heSo = (ct.getHangVe().getHeSoGia() != null)
                        ? ct.getHangVe().getHeSoGia().doubleValue()
                        : 1.0;

                double finalPrice = basePrice * heSo;
                
                com.flight.ticket.dto.FlightClassDetailDto classDetail = com.flight.ticket.dto.FlightClassDetailDto.builder()
                        .maHangVe(ct.getHangVe().getMaHangVe())
                        .tenHangVe(ct.getHangVe().getTenHangVe())
                        .gia(finalPrice)
                        .soLuongCho(ct.getSoLuongCho())
                        .soLuongChoConLai(ct.getSoLuongConLai())
                        .build();
                classDetails.add(classDetail);
            }

            dto.setChiTietHangVe(classDetails);

            // Gán số lượng chỗ vào DTO
            dto.setSoLuongCho(totalSoLuongCho);
            dto.setSoLuongChoConLai(totalSoLuongChoConLai);

            // Gán giá hiển thị mặc định (giá rẻ nhất)
            if (!classDetails.isEmpty()) {
                double minPrice = classDetails.stream()
                        .mapToDouble(com.flight.ticket.dto.FlightClassDetailDto::getGia)
                        .min().orElse(0.0);
                dto.setGiaCoBan(minPrice);
            }
        }

        return dto;
    }

    public List<FlightDto> getAllFlights() {
        return flightRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<FlightDto> searchFlights(String diemDi, String diemDen, LocalDate ngayDi) {
        List<ChuyenBay> list;
        if (diemDi != null && diemDen != null && ngayDi != null) {
            LocalDateTime startOfDay = ngayDi.atStartOfDay();
            LocalDateTime endOfDay = ngayDi.atTime(23, 59, 59);
            list = flightRepository.findByMaSanBayDi_ThanhPhoAndMaSanBayDen_ThanhPhoAndNgayGioKhoiHanhBetween(
                    diemDi, diemDen, startOfDay, endOfDay);
        } else {
            list = flightRepository.findAll();
        }
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ChuyenBay createFlight(ChuyenBay chuyenBay) {
        return flightRepository.save(chuyenBay);
    }

    public ChuyenBay updateFlight(Integer id, ChuyenBay flightDetails) {
        ChuyenBay flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ChuyenBay not found for this id :: " + id));

        flight.setMaHangHK(flightDetails.getMaHangHK());
        flight.setMaMayBay(flightDetails.getMaMayBay());
        flight.setMaSanBayDi(flightDetails.getMaSanBayDi());
        flight.setMaSanBayDen(flightDetails.getMaSanBayDen());
        flight.setNgayGioKhoiHanh(flightDetails.getNgayGioKhoiHanh());
        flight.setNgayGioHaCanh(flightDetails.getNgayGioHaCanh());
        flight.setThoiGianBay(flightDetails.getThoiGianBay());
        flight.setTrangThai(flightDetails.getTrangThai());

        return flightRepository.save(flight);
    }

    public void deleteFlight(Integer id) {
        ChuyenBay flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ChuyenBay not found for this id :: " + id));
        flightRepository.delete(flight);
    }

    public Optional<ChuyenBay> getFlightById(Integer id) {
        return flightRepository.findById(id);
    }
}