package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Action;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@NoArgsConstructor
public class ActionDTO {
    private Long id;
    private String startDateTime;
    private String endDateTime;
    private Integer personLimit;
    private Boolean used;

    private List<String> additionalServices;
    private Double price;
    private String expirationDateTime;
    private Long bookableId;
    private final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public ActionDTO(Action action) {
        this.id = action.getId();
        this.startDateTime = FORMATTER.format(action.getStartDateTime());
        this.endDateTime = FORMATTER.format(action.getEndDateTime());
        this.personLimit = action.getPersonLimit();
        //this.additionalServices = action.getAdditionalServices();
        this.price = action.getPrice();
        this.expirationDateTime = FORMATTER.format(action.getExpirationDateTime());
        this.bookableId = action.getBookable().getId();
        this.used = action.getUsed();
    }
}
