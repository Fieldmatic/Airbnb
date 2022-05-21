package mrsisa.project.model;


import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Instructor extends Owner {
    private String biography;
    @OneToMany(fetch = FetchType.EAGER)
    private List<Adventure> adventures;
}
