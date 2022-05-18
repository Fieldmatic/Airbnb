package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity
public class RegistrationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String reason;
    @OneToOne
    private Person user;
    private Boolean approved;
    private Boolean viewed;

    public RegistrationRequest(String reason, Person user) {
        this.reason = reason;
        this.user = user;
        this.viewed = false;
    }

}
