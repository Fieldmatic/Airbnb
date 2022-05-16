package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Bookable {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private Long id;
    private String name;
    @OneToOne
    private Address address;
    private String promotionalDescription;
    @ElementCollection
    private List<String> pictures;
    private String profilePicture;
    private String rules;
    private Double rating;
    @OneToMany
    private List<Tag> additionalServices;
    @OneToMany(fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Review> reviews;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Action> actions;
    @OneToOne
    private PriceList priceList;
    @OneToMany
    private List<Reservation> reservations;
    @OneToMany
    private List<Period> periods;

}
