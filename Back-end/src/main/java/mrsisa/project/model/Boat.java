package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Boat extends Bookable {
    private BoatType type;
    private double length;
    private Integer enginesNumber;
    private Double enginePower;
    private Double maxSpeed;
    private Integer capacity;

    @ElementCollection
    private List<String> navigationEquipment;

    @ElementCollection
    private List<String> fishingEquipment;
}