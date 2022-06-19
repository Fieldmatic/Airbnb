package mrsisa.project.repository;

import mrsisa.project.model.Adventure;
import mrsisa.project.model.Boat;
import mrsisa.project.model.Cottage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AdventureRepository extends JpaRepository<Adventure, Long> {

    List<Adventure> findAdventuresByInstructor_Id(Long id);

    @Query(value = "SELECT a FROM Adventure a LEFT JOIN FETCH a.reviews where a.id=?1")
    Adventure findByIdWithReviews(Long id);
    @Query(value = "SELECT a FROM Adventure a LEFT JOIN FETCH a.additionalServices where a.id=?1")
    Optional<Adventure> findById(Long id);
}
