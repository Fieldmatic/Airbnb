package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PasswordChangeDTO {
    private String oldPassword;
    private String newPassword;
}
