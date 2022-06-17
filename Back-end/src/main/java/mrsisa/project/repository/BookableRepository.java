package mrsisa.project.repository;

import mrsisa.project.model.Bookable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.awt.print.Book;

public interface BookableRepository extends JpaRepository<Bookable,Long> {

    @Override
    @Query(value = "SELECT b FROM Bookable b LEFT JOIN FETCH b.reservations where b.id=?1")
    Bookable getById(Long id);

    @Query(value = "SELECT b FROM Bookable b LEFT JOIN FETCH b.actions where b.id=?1")
    Bookable getByIdWithActions(Long id);

    @Query(value = "SELECT b FROM Bookable b LEFT JOIN FETCH b.periods where b.id=?1")
    Bookable getByIdWithPeriods(Long id);
    
    @Query(value = "SELECT b FROM Bookable b LEFT JOIN FETCH b.subscribedClients where b.id=?1")
    Bookable getByIdWithSubscribedClients(Long id);

    @Query(value = "SELECT b FROM Bookable b LEFT JOIN FETCH b.reviews where b.id=?1")
    Bookable getByIdWithReviews(Long id);
}
