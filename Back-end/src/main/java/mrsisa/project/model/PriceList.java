package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
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
}
