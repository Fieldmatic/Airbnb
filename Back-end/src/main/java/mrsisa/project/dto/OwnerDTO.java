package mrsisa.project.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;


@Data
@NoArgsConstructor
public class OwnerDTO {
    private String username;
    private String password;
    private String name;
    private String surname;
    private String email;
    private String profilePhoto;
    private String phoneNumber;
    private Address address;
    private String registrationExplanation;
    private String role;
}
