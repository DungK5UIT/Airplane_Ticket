package com.flight.ticket.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "CT_CHUYENBAY")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CT_ChuyenBay {

    @EmbeddedId
    private CT_ChuyenBayId id;

    @ManyToOne
    @MapsId("maChuyenBay")
    @JoinColumn(name = "MaChuyenBay", referencedColumnName = "MaChuyenBay")
    private ChuyenBay chuyenBay;

    @ManyToOne
    @MapsId("maHangVe")
    @JoinColumn(name = "MaHangVe", referencedColumnName = "MaHangVe")
    private HangVe hangVe;

    @Column(name = "so_luong_cho")
    private int soLuongCho;

    @Column(name = "so_luong_con_lai")
    private int soLuongConLai;

    @Column(name = "gia_co_ban")
    private double giaCoBan;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode // 🔥 BẮT BUỘC để tránh warning
    public static class CT_ChuyenBayId implements Serializable {

        private int maChuyenBay;
        private int maHangVe;
    }
}