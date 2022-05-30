package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.Person;

@Data
@NoArgsConstructor
public class UserDetailsDTO {
        private Long id;
        private String username;
        private String password;
        private String name;
        private String surname;
        private String email;
        private String profilePhoto;
        private String phoneNumber;
        private Address address;

        public UserDetailsDTO(Person person) {
            this.id = person.getId();
            this.username = person.getUsername();
            this.password = person.getPassword();
            this.name = person.getName();
            this.surname = person.getSurname();
            this.email = person.getEmail();
            this.profilePhoto = person.getProfilePhoto();
            this.phoneNumber = person.getPhoneNumber();
            this.address = person.getAddress();
        }


}
