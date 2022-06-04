package mrsisa.project.repository;

import mrsisa.project.model.CottageOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CottageOwnerRepository extends JpaRepository<CottageOwner, Long> {
    @Query(value = "SELECT o FROM CottageOwner o JOIN FETCH o.cottages where o.username=?1")
    CottageOwner findByUsername(String username);
}
