package com.flight.ticket.service;

import com.flight.ticket.dto.AirportDto;
import com.flight.ticket.model.SanBay;
import com.flight.ticket.repository.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirportService {

    @Autowired
    private AirportRepository airportRepository;

    public List<AirportDto> getAllAirports() {
        List<SanBay> sanbay = airportRepository.findAll();
        return sanbay.stream().map(airport -> AirportDto.builder()
                .maSanBay(airport.getMaSanBay())
                .maIATA(airport.getMaIATA())
                .tenSanBay(airport.getTenSanBay())
                .thanhPho(airport.getThanhPho())
                .quocGia(airport.getQuocGia())
                .build()
        ).toList();
    }
}
