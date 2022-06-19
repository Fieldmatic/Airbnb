package mrsisa.project.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class PriceList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double hourlyRate;
    private Double dailyRate;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String cancellationConditions;
    @OneToOne
    private Bookable bookable;
}
