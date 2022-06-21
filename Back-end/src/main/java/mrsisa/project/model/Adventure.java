package mrsisa.project.model;

import lombok.Data;
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
public class Adventure extends Bookable{

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<String> fishingEquipment;
    @ManyToOne
    private Instructor instructor;

}
