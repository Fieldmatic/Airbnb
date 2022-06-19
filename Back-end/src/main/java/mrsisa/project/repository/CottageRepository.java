package mrsisa.project.repository;

import mrsisa.project.model.Cottage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CottageRepository extends JpaRepository<Cottage, Long> {
    //@Query(value = "SELECT * FROM cottage c left join cottage_owner_cottages b on c.id = b.cottages_id where b.cottage_owner_id = ?1", nativeQuery = true)
    //List<Cottage> findOwnerCottages(Long id);

    List<Cottage> findAllByCottageOwner_Id(Long id);

    @Query(value = "SELECT c FROM Cottage c LEFT JOIN FETCH c.reviews where c.id=?1")
    Cottage findByIdWithReviews(Long id);

    @Query(value = "SELECT c FROM Cottage c LEFT JOIN FETCH c.reservations where c.id=?1")
    Cottage findByIdWithReservations(Long id);
    
    @Query(value = "SELECT c FROM Cottage c LEFT JOIN FETCH c.periods")
    List<Cottage> findAllWithPeriods();

}
