package mrsisa.project.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mrsisa.project.model.ProfileDeletionReason;

@Setter
@Getter
@NoArgsConstructor
public class ProfileDeletionReasonDTO {
    private Long id;
    private String reason;
    private Boolean approved;

    public ProfileDeletionReasonDTO(ProfileDeletionReason profileDeletionReason) {
        this.id = profileDeletionReason.getId();
        this.reason = profileDeletionReason.getReason();
        this.approved = profileDeletionReason.getApproved();
    }
}
