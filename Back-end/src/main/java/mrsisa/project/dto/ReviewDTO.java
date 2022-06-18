package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Review;

@Data
@NoArgsConstructor
public class ReviewDTO {
    private Long reservationId;
    private Long ownerId;
    private Long bookableId;
    private int ownerRating;
    private int bookableRating;
    private String ownerComment;
    private String bookableComment;
    private Boolean answered;

    public ReviewDTO(Review review) {
        this.reservationId = review.getReservation().getId();
        this.ownerId = review.getOwner().getId();
        this.bookableId = review.getBookable().getId();
        this.ownerRating = review.getOwnerRating();
        this.bookableRating = review.getBookableRating();
        this.ownerComment = review.getOwnerComment();
        this.bookableComment = review.getBookableComment();
    }
}
