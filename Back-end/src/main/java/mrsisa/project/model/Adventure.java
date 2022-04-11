package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
public class Adventure extends Bookable{

    private Integer capacity;

    @ElementCollection
    private List<String> fishingEquipment;

}
