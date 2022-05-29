package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;

@Data
@NoArgsConstructor
public class PasswordChangeDTO {
    private String oldPassword;
    private String newPassword;
}
