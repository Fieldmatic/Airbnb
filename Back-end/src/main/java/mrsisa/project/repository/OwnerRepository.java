package mrsisa.project.repository;

import mrsisa.project.model.Bookable;
import mrsisa.project.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OwnerRepository extends JpaRepository<Owner, Long>  {
    @Query(value = "SELECT o FROM Owner o LEFT JOIN FETCH o.reviews where o.id=?1")
    Owner getByIdWithReviews(Long id);
}
