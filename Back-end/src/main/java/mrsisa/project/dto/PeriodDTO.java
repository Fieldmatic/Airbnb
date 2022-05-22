package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PeriodDTO {
    private String startDateTime;
    private String endDateTime;
    private Long bookableId;
}

