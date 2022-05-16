package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
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
}
