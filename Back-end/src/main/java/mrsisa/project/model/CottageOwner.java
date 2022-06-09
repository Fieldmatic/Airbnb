package mrsisa.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
public class CottageOwner extends Owner {
    @OneToMany(mappedBy = "cottageOwner",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Cottage> cottages;
}
