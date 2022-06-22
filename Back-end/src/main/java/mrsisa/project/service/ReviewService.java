package mrsisa.project.service;

import mrsisa.project.dto.CottageDTO;
import mrsisa.project.dto.ReviewDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.BookableRepository;
import mrsisa.project.repository.OwnerRepository;
import mrsisa.project.repository.ReservationRepository;
import mrsisa.project.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
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

    @Autowired
    private EmailService emailService;


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

    public List<ReviewDTO> getAllReviews() {
        List<ReviewDTO> reportDTOS = new ArrayList<>();
        for(Review review : reviewRepository.findAll()) {
            if (!review.isAnswered())
                reportDTOS.add(new ReviewDTO(review));
        }
        return reportDTOS;
    }

    public Review findById(Long id) {
        return reviewRepository.getById(id);
    }

    public void acceptReview(Review review) {
        review.setAnswered(true);
        reviewRepository.save(review);
        Owner owner = ownerRepository.findByUsername(review.getOwner().getUsername());
        emailService.sendReviewMail(owner, review.getOwnerComment(), review.getBookableComment());
    }

    public void denyReview(Review review) {
        review.setAnswered(true);
        reviewRepository.save(review);
    }

    public List<ReviewDTO> findBookableReviews(Long bookaleId) {
        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        for (Review review : reviewRepository.findReviewsByBookable_Id(bookaleId)) {
            //stavi na answered
            if (review.isAnswered())
                reviewDTOS.add(new ReviewDTO(review));
        }
        return reviewDTOS;
    }

    public List<Review> findAll() {
        return reviewRepository.findAll();
    }
}
