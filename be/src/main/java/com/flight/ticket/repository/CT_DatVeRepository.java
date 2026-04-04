package com.flight.ticket.repository;

import com.flight.ticket.model.CT_DatVe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CT_DatVeRepository extends JpaRepository<CT_DatVe, Integer> {
}
