package mrsisa.project.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Bookable bookable;
    @ManyToOne
    private Owner owner;
    private int ownerRating;
    private int bookableRating;
    private String ownerComment;
    private String bookableComment;
    @Column(columnDefinition = "boolean default false", nullable = false)
    private boolean answered = false;
    @OneToOne
    private Reservation reservation;
}
