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
public class Action {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Integer personLimit;
    private Boolean used;
    @ManyToMany
    private List<Tag> additionalServices;
    private Double price;
    private LocalDateTime expirationDateTime;
    @ManyToOne
    private Bookable bookable;

}
