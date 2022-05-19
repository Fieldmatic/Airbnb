package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
public class CottageOwner extends Owner {
    @OneToMany(cascade = CascadeType.ALL)
    private List<Cottage> cottages;
}
