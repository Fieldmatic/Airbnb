package mrsisa.project.model;


import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

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

}
