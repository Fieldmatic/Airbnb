package mrsisa.project.repository;

import mrsisa.project.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OwnerRepository extends JpaRepository<Owner, Long>  {
}
