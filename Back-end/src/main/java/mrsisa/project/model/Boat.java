package mrsisa.project.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Boat extends Bookable {
    private BoatType type;
    private double length;
    private Integer enginesNumber;
    private Double enginePower;
    private Double maxSpeed;

    @ManyToOne
    private BoatOwner boatOwner;

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<String> navigationEquipment;

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<String> fishingEquipment;
}