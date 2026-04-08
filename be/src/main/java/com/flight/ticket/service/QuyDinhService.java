package com.flight.ticket.service;

import com.flight.ticket.model.QuyDinh;
import com.flight.ticket.repository.QuyDinhRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuyDinhService {
    @Autowired
    private QuyDinhRepository quyDinhRepository;

    public QuyDinh getQuyDinh() {
        return quyDinhRepository.findAll().stream().findFirst()
                .orElse(QuyDinh.builder()
                        .soLuongSanBay(5)
                        .thoiGianBayToiThieu(30)
                        .soSanBayTrungGianToiDa(2)
                        .thoiGianDungToiThieu(20)
                        .thoiGianDungToiDa(60)
                        .soLuongHangVe(4)
                        .thoiGianChamNhatKhiDatVe(24)
                        .thoiGianHuyDatVe(24)
                        .build());
    }

    public QuyDinh updateQuyDinh(QuyDinh newQuyDinh) {
        QuyDinh current = getQuyDinh();
        if (current.getId() != null) {
            newQuyDinh.setId(current.getId());
        }
        return quyDinhRepository.save(newQuyDinh);
    }
}
