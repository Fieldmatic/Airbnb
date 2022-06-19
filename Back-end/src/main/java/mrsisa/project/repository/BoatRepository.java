package mrsisa.project.repository;

import mrsisa.project.model.Boat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BoatRepository extends JpaRepository<Boat, Long> {
    @Query(value = "SELECT * FROM boat c join fetch bookable_additional_services left join boat_owner_boats b on c.id = b.boats_id where b.boat_owner_id = ?1", nativeQuery = true)
    List<Boat> findOwnerBoats(Long id);

    List<Boat> findBoatsByBoatOwner_Id(Long id);

    @Query(value = "SELECT b FROM Boat b LEFT JOIN FETCH b.reviews where b.id=?1")
    Boat findByIdWithReviews(Long id);

    @Query(value = "SELECT b FROM Boat b LEFT JOIN FETCH b.reservations where b.id=?1")
    Boat findByIdWithReservations(Long id);
}
