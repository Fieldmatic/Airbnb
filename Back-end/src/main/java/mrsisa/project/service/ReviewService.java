package mrsisa.project.service;

import mrsisa.project.dto.ReportDTO;
import mrsisa.project.dto.ReviewDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.BookableRepository;
import mrsisa.project.repository.OwnerRepository;
import mrsisa.project.repository.ReservationRepository;
import mrsisa.project.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Book;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private BookableRepository bookableRepository;

    @Autowired
    private OwnerRepository ownerRepository;


    public boolean checkIfReviewed(String review, int rate) {
        if (review.isEmpty() && rate == 0)
                return false;
        return true;
    }

    @Transactional
    public boolean add(ReviewDTO reviewDTO) {
        Optional<Review> review = reviewRepository.findReviewByReservation_Id(reviewDTO.getReservationId());
        if (review.isPresent()) {
            Review rev = review.get();
            if (!rev.getReservation().getOwnerReviewed()) {
                rev.setOwnerComment(reviewDTO.getOwnerComment());
                rev.setOwnerRating(reviewDTO.getOwnerRating());
                rev.getReservation().setOwnerReviewed(true);
            } else {
                rev.setBookableComment(reviewDTO.getBookableComment());
                rev.setBookableRating(reviewDTO.getBookableRating());
                rev.getReservation().setBookableReviewed(true);
            }
            reservationRepository.save(rev.getReservation());
            reviewRepository.save(rev);
        } else {
            Review newReview = dtoToReview(reviewDTO);

            Bookable bookable = bookableRepository.getByIdWithReviews(reviewDTO.getBookableId());
            newReview.setBookable(bookableRepository.getById(reviewDTO.getBookableId()));
            Reservation reservation = reservationRepository.getById(reviewDTO.getReservationId());
            newReview.setReservation(reservation);
            Owner owner = ownerRepository.getByIdWithReviews(reviewDTO.getOwnerId());
            newReview.setOwner(ownerRepository.getById(reviewDTO.getOwnerId()));

            owner.getReviews().add(newReview);
            bookable.getReviews().add(newReview);
            reservation.setOwnerReviewed(checkIfReviewed(newReview.getOwnerComment(), newReview.getOwnerRating()));
            reservation.setBookableReviewed(checkIfReviewed(newReview.getBookableComment(), newReview.getBookableRating()));
            reservation.setReview(newReview);
            reviewRepository.save(newReview);
            bookableRepository.save(bookable);
            ownerRepository.save(owner);
        }
        return true;
    }

    Review dtoToReview(ReviewDTO reviewDTO){
        Review review = new Review();
        review.setBookableComment(reviewDTO.getBookableComment());
        review.setBookableRating(reviewDTO.getBookableRating());
        review.setOwnerComment(reviewDTO.getOwnerComment());
        review.setOwnerRating(reviewDTO.getOwnerRating());
        return review;
    }
}
