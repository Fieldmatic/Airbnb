package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ComplaintDTO {
    private Long reservationId;
    private Long ownerId;
    private Long bookableId;
    private String ownerComment;
    private String bookableComment;
    private Boolean answered;

}
