package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
public class Adventure extends Bookable{

    private Integer capacity;

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<String> fishingEquipment;

    @OneToMany
    private List<Period> busyPeriods;
}
