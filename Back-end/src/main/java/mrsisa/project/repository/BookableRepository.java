package mrsisa.project.repository;

import mrsisa.project.model.Bookable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookableRepository extends JpaRepository<Bookable,Long> {
}
