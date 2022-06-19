package mrsisa.project.repository;

import mrsisa.project.model.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {

    @Query(value = "SELECT instructor FROM Instructor instructor LEFT JOIN FETCH instructor.adventures WHERE instructor.id=?1")
    Optional<Instructor> findById(Long id);

    @Query(value = "SELECT i FROM Instructor i LEFT JOIN FETCH i.adventures where i.username=?1")
    Instructor findByUsername(String username);
}
