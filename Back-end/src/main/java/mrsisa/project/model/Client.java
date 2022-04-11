package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Data
@NoArgsConstructor
@Entity
public class Client extends Person {
    @ManyToOne
    private ClientCategory category;
    private Integer penalties;
    private Integer points;
    //lista rezervacija
}
