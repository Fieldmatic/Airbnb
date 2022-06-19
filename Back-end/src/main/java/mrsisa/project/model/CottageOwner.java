package mrsisa.project.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class CottageOwner extends Owner {
    @OneToMany(mappedBy = "cottageOwner",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Cottage> cottages;
}
