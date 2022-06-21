package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.Owner;
import mrsisa.project.model.Person;
import mrsisa.project.model.UserCategory;

@Data
@NoArgsConstructor
public class OwnerDetailsDTO {
        private Long id;
        private String username;
        private String password;
        private String name;
        private String surname;
        private String email;
        private String profilePhoto;
        private String phoneNumber;
        private Address address;
        private UserCategory category;
        private Integer points;

        public OwnerDetailsDTO(Owner owner) {
            this.id = owner.getId();
            this.username = owner.getUsername();
            this.password = owner.getPassword();
            this.name = owner.getName();
            this.surname = owner.getSurname();
            this.email = owner.getEmail();
            this.profilePhoto = owner.getProfilePhoto();
            this.phoneNumber = owner.getPhoneNumber();
            this.address = owner.getAddress();
            this.category = owner.getCategory();
            this.points = owner.getPoints();
        }


}
