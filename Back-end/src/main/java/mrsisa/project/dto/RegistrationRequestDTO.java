package mrsisa.project.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mrsisa.project.model.Person;
import mrsisa.project.model.ProfileDeletionReason;
import mrsisa.project.model.RegistrationRequest;

@Setter
@Getter
@NoArgsConstructor
public class RegistrationRequestDTO {
    private Long id;
    private String reason;
    private Boolean approved;
    private PersonBasicInfoDTO user;

    public RegistrationRequestDTO(RegistrationRequest registrationRequest, PersonBasicInfoDTO personInfo) {
        this.id = registrationRequest.getId();
        this.reason = registrationRequest.getReason();
        this.approved = registrationRequest.getApproved();
        this.user = personInfo;
    }
}
