package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
public class Client extends Person {
    @ManyToOne
    private ClientCategory category;
    private Integer penalties;
    private Integer points;
    @OneToMany(cascade=CascadeType.ALL)
    private List<Reservation> reservations;
    @OneToMany
    private List<Report> reports;
}
