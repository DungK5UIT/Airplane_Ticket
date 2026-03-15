package com.flight.ticket.repository;

import com.flight.ticket.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    List<Flight> findByOriginAndDestination(String origin, String destination);
    List<Flight> findByOrigin(String origin);
    List<Flight> findByDestination(String destination);
}
