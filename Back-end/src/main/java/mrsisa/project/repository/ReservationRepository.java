package mrsisa.project.repository;

import mrsisa.project.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query(value = "SELECT * FROM reservation r where r.bookable_id = ?1 and r.active = true", nativeQuery = true)
    List<Reservation> getActiveReservations(Long id);
}
