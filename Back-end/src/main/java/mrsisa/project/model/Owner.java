package mrsisa.project.model;


import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@Data
@NoArgsConstructor
public class Owner extends Person {
    private Integer points;
    private Boolean approvedAccount;
    private String registrationExplanation;
    @ManyToOne
    private OwnerCategory category;

}
