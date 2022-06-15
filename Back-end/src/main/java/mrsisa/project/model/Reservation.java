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
    @ManyToOne
    private Client client;
    @ManyToOne
    private Bookable bookable;

    @OneToOne
    private Report report;
}
