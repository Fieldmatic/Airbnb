package mrsisa.project.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Instructor extends Owner {
    private String biography;
    @OneToMany(cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Adventure> adventures;
}
