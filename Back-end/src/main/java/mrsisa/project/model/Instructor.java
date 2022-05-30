package mrsisa.project.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Instructor extends Owner {
    private String biography;
    @OneToMany(cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Adventure> adventures;
}
