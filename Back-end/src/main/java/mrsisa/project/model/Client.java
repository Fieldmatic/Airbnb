package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
public class Client extends Person {
    @ManyToOne
    private UserCategory category;
    private Integer penalties;
    private Integer points;
    @OneToMany(cascade=CascadeType.ALL)
    private List<Reservation> reservations;
    @OneToMany
    private List<Report> reports;
    @ManyToMany(cascade=CascadeType.ALL, fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Bookable> subscriptions;
}
