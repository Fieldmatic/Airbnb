package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.*;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

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
