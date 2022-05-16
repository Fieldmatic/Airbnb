package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Bookable;
import mrsisa.project.model.Tag;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class ActionDTO {
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Integer personLimit;
    private List<String> additionalServices;
    private Double price;
    private LocalDateTime expirationDate;
    private Long bookableId;
}
