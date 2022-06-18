package mrsisa.project.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.Instructor;
import mrsisa.project.model.UserCategory;


@Data
@NoArgsConstructor
public class InstructorDTO {

    private Long id;
    private String name;
    private Address address;
    private String surname;
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private String registrationExplanation;
    private String biography;
    private UserCategory category;
    private Integer points;

    public InstructorDTO(Instructor instructor){
        this.id = instructor.getId();
        this.name = instructor.getName();
        this.address = instructor.getAddress();
        this.biography = instructor.getBiography();
        this.surname = instructor.getSurname();
        this.username = instructor.getUsername();
        this.password = instructor.getPassword();
        this.email = instructor.getEmail();
        this.phoneNumber = instructor.getPhoneNumber();
        this.registrationExplanation = instructor.getRegistrationExplanation();
        this.category = instructor.getCategory();
        this.points = instructor.getPoints();
    }
}
