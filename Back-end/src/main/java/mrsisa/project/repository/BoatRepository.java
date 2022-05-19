package mrsisa.project.repository;

import mrsisa.project.model.Boat;
import mrsisa.project.model.Cottage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BoatRepository extends JpaRepository<Boat, Long> {
    @Query(value = "SELECT * FROM boat c left join boat_owner_boats b on c.id = b.boats_id where b.boat_owner_id = ?1", nativeQuery = true)
    List<Boat> findOwnerBoats(Long id);
}
