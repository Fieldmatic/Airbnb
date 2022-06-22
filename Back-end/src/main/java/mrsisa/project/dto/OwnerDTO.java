package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Instructor;
import mrsisa.project.model.Owner;

@Data
@NoArgsConstructor
public class OwnerDTO {
    private String name;
    private String surname;
    private String biography;

    public OwnerDTO(Owner owner){
        this.name = owner.getName();
        this.surname = owner.getSurname();
    }

    public OwnerDTO(Instructor instructor){
        this.name = instructor.getName();
        this.surname = instructor.getSurname();
        this.biography = instructor.getBiography();

    }





}
