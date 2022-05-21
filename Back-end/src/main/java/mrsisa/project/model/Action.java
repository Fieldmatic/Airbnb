package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Action {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Integer personLimit;
    @ManyToMany
    private List<Tag> additionalServices;
    private Double price;
    private LocalDateTime expirationDateTime;
    @ManyToOne
    private Bookable bookable;

}
