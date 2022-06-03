package mrsisa.project.repository;

import mrsisa.project.model.Bookable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.awt.print.Book;

public interface BookableRepository extends JpaRepository<Bookable,Long> {

    @Override
    @Query(value = "SELECT b FROM Bookable b JOIN FETCH b.reservations where b.id=?1")
    Bookable getById(Long id);
}
