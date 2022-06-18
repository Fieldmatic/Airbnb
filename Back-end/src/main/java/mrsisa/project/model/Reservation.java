package mrsisa.project.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Integer personLimit;
    @ManyToMany
    private List<Tag> additionalServices;
    private Double price;
    private Boolean active;
    @Column(columnDefinition = "boolean default false", nullable = false)
    private Boolean reported = false;
    @Column(columnDefinition = "boolean default false", nullable = false)
    private Boolean ownerReviewed = false;
    @Column(columnDefinition = "boolean default false", nullable = false)
    private Boolean bookableReviewed = false;
    @Column(columnDefinition = "boolean default false", nullable = false)
    private Boolean ownerComplained = false;
    @Column(columnDefinition = "boolean default false", nullable = false)
    private Boolean bookableComplained = false;
    @ManyToOne
    private Client client;
    @ManyToOne
    private Bookable bookable;
    @OneToOne
    private Report report;
    @OneToOne
    private Review review;
    @OneToOne
    private Complaint complaint;
}
