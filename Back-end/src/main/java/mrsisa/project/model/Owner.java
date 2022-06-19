package mrsisa.project.model;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Owner extends Person {
    private Integer points;
    private Boolean approvedAccount;
    private String registrationExplanation;
    @ManyToOne
    private OwnerCategory category;
    @OneToMany
    private List<Review> reviews;
    @OneToMany
    private List<Complaint> complaints;

}
