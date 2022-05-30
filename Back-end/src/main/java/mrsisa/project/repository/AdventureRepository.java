package mrsisa.project.repository;

import mrsisa.project.model.Adventure;
import mrsisa.project.model.Boat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdventureRepository extends JpaRepository<Adventure, Long> {

    @Query(value = "SELECT * FROM adventure c left join instructor_adventures b on c.id = b.adventures_id where b.instructor_id = ?1", nativeQuery = true)
    List<Adventure> findInstructorAdventures(Long id);
}
