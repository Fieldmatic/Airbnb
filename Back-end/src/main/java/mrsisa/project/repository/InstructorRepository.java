package mrsisa.project.repository;

import mrsisa.project.model.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {

    @Query(value = "SELECT instructor FROM Instructor instructor JOIN FETCH instructor.adventures WHERE instructor.id=?1")
    Optional<Instructor> findById(Long id);
}
