package mrsisa.project.repository;

import mrsisa.project.model.Adventure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AdventureRepository extends JpaRepository<Adventure, Long> {

    @Query(value = "SELECT * FROM adventure c left join instructor_adventures b on c.id = b.adventures_id where b.instructor_id = ?1", nativeQuery = true)
    List<Adventure> findInstructorAdventures(Long id);

    @Query(value = "SELECT a FROM Adventure a LEFT JOIN FETCH a.reviews where a.id=?1")
    Adventure findByIdWithReviews(Long id);
    @Query(value = "SELECT a FROM Adventure a LEFT JOIN FETCH a.additionalServices where a.id=?1")
    Optional<Adventure> findById(Long id);
}
