package com.flight.ticket.repository;

import com.flight.ticket.model.DatVe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DatVeRepository extends JpaRepository<DatVe, Integer> {
}
