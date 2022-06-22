package mrsisa.project.repository;

import mrsisa.project.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findReviewByReservation_Id(Long id);

    List<Review> findReviewsByBookable_Id(Long id);

    @Query(value = "SELECT r FROM Review r  where r.id=?1")
    Review findReviewById(Long id);
}
