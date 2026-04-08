package com.flight.ticket.repository;

import com.flight.ticket.model.CT_DatVe;
import com.flight.ticket.model.DatVe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface CT_DatVeRepository extends JpaRepository<CT_DatVe, Integer> {
    
    @Query("SELECT c.soGhe FROM CT_DatVe c WHERE c.maChuyenBay.maChuyenBay = :maChuyenBay AND c.soGhe IS NOT NULL")
    List<String> findBookedSeatsByMaChuyenBay(@Param("maChuyenBay") Integer maChuyenBay);

    List<CT_DatVe> findByMaDatVe(DatVe maDatVe);
}
