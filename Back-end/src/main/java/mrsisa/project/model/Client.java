package mrsisa.project.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
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
    @ManyToMany(cascade=CascadeType.ALL, fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Bookable> subscriptions;
}
