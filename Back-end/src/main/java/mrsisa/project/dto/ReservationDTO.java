package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Bookable;
import mrsisa.project.model.Client;
import mrsisa.project.model.Reservation;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@NoArgsConstructor
public class ReservationDTO {

    public ReservationDTO(Reservation reservation){
        this.id = reservation.getId();
        this.startDateTime = FORMATTER.format(reservation.getStartDateTime());
        this.endDateTime = FORMATTER.format(reservation.getEndDateTime());
        this.personLimit = reservation.getPersonLimit();
        this.price = reservation.getPrice();
        this.active = reservation.getActive();
        this.clientId = reservation.getClient().getId();
        this.bookableId = reservation.getBookable().getId();
        try {
            this.reportId = reservation.getReport().getId();
        }catch (NullPointerException ne){
            this.reportId = null;
        }
    }

    private Long id;
    private String startDateTime;
    private String endDateTime;
    private Integer personLimit;
    //@ManyToMany
    //private List<Tag> additionalServices;
    private Double price;
    private Boolean active;
    private Long clientId;
    private Long bookableId;
    private Long reportId;
    private final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
}
