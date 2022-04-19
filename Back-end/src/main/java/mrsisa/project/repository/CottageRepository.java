package mrsisa.project.repository;

import mrsisa.project.model.Cottage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CottageRepository extends JpaRepository<Cottage, Long> {
}
