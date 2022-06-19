package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.Person;

@Data
@NoArgsConstructor
public class PersonBasicInfoDTO {
    private Long id;
    private String username;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private Address address;

    public PersonBasicInfoDTO(Person person) {
        this.id = person.getId();
        this.name = person.getName();
        this.surname = person.getSurname();
        this.email = person.getEmail();
        this.phoneNumber = person.getPhoneNumber();
        this.address = person.getAddress();
    }
}