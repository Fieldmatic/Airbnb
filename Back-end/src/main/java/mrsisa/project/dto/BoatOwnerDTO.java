package mrsisa.project.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.UserCategory;


@Data
@NoArgsConstructor
public class BoatOwnerDTO {
    private String username;
    private String password;
    private String name;
    private String surname;
    private String email;
    private String profilePhoto;
    private String phoneNumber;
    private Address address;
    private String registrationExplanation;
    private UserCategory category;
    private Integer points;
}
