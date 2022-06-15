package mrsisa.project.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Map;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Cottage extends Bookable {
    @ElementCollection(fetch = FetchType.EAGER)
    private Map<Integer, Integer> rooms;
    @ManyToOne
    private CottageOwner cottageOwner;
}