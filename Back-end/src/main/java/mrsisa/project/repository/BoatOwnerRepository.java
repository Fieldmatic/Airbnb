package mrsisa.project.repository;

import mrsisa.project.model.Adventure;
import mrsisa.project.model.Boat;
import mrsisa.project.model.BoatOwner;
import mrsisa.project.model.CottageOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BoatOwnerRepository extends JpaRepository<BoatOwner, Long> {
    @Query(value = "SELECT b FROM BoatOwner b LEFT JOIN FETCH b.boats where b.username=?1")
    BoatOwner findByUsername(String username);
}
