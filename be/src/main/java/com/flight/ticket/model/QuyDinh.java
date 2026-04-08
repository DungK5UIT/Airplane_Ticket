package com.flight.ticket.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quy_dinh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuyDinh {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // QĐ1
    private Integer soLuongSanBay;
    private Integer thoiGianBayToiThieu; // Phút
    private Integer soSanBayTrungGianToiDa;
    private Integer thoiGianDungToiThieu; // Phút
    private Integer thoiGianDungToiDa; // Phút

    // QĐ2
    private Integer soLuongHangVe;

    // QĐ3
    private Integer thoiGianChamNhatKhiDatVe; // Giờ
    private Integer thoiGianHuyDatVe; // Giờ
}
