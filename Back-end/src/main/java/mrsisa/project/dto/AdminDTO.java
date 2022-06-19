package mrsisa.project.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.Administrator;

@Data
@NoArgsConstructor
public class AdminDTO {

    private Long id;
    private String name;
    private Address address;
    private String surname;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String newPassword;

    public AdminDTO(Administrator administrator){
        this.id = administrator.getId();
        this.name = administrator.getName();
        this.address = administrator.getAddress();
        this.surname = administrator.getSurname();
        this.username = administrator.getUsername();
        this.password = administrator.getPassword();
        this.email = administrator.getEmail();
        this.phone = administrator.getPhoneNumber();
    }

}
