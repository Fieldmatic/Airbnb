package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.Client;

@Data
@NoArgsConstructor
public class ClientBasicInfoDTO {
    private Long id;
    private String username;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private Address address;

    public ClientBasicInfoDTO(Client client) {
        this.id = client.getId();
        this.name = client.getName();
        this.surname = client.getSurname();
        this.email = client.getEmail();
        this.phoneNumber = client.getPhoneNumber();
        this.address = client.getAddress();
    }
}