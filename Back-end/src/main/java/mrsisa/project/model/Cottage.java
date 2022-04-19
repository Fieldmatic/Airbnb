package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
public class Cottage extends Bookable {
    @ElementCollection(fetch = FetchType.EAGER)
    private Map<Integer, Integer> rooms;
}