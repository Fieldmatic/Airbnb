package mrsisa.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class CottageOwner extends Owner {
    @OneToMany(mappedBy = "cottageOwner",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Cottage> cottages;
}
