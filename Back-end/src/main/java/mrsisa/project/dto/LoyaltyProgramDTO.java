package mrsisa.project.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Setter
@Getter
@NoArgsConstructor
public class LoyaltyProgramDTO {
    private Long id;
    private int clientPoints;
    private int ownerPoints;
    private int bronzePoints;
    private int silverPoints;
    private int goldPoints;
}

