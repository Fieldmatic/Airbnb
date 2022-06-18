package mrsisa.project.model;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    private Reservation reservation;
    @ManyToOne
    private Bookable bookable;
    @ManyToOne
    private Owner owner;
    private String ownerComment;
    private String bookableComment;
    @Column(columnDefinition = "boolean default false", nullable = false)
    private boolean answered = false;
}
