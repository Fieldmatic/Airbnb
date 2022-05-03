package mrsisa.project.repository;

import mrsisa.project.model.Adventure;
import mrsisa.project.model.BoatOwner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoatOwnerRepository extends JpaRepository<BoatOwner, Long> {
}
