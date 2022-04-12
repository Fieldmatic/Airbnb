package mrsisa.project.model;


import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;

@Entity
@Data
@NoArgsConstructor
public class Instructor extends Owner {
    private String biography;
}
