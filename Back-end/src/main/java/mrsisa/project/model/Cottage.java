package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
public class Cottage extends Bookable {
    @ElementCollection
    Map<Integer, Integer> rooms;
}