package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.*;

import javax.persistence.Column;
import javax.persistence.ManyToMany;
import java.awt.print.Book;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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
        String[] bookableTypeParts = reservation.getBookable().getClass().getTypeName().split("[.]");
        this.bookableType = bookableTypeParts[bookableTypeParts.length-1];
        this.bookableName = reservation.getBookable().getName();
        this.bookableAddress = reservation.getBookable().getAddress();
        this.ownerPhoneNumber = getBookableOwnerPhoneNum(reservation.getBookable());
        this.ownerId = getBookableOwnerId(reservation.getBookable());
        this.reported = reservation.getReported();
        this.ownerReviewed = reservation.getOwnerReviewed();
        this.bookableReviewed = reservation.getBookableReviewed();
        try {
            this.reportId = reservation.getReport().getId();
        }catch (NullPointerException ne){
            this.reportId = null;
        }
        this.additionalServices = getStringAdditionalServices(reservation.getAdditionalServices());

    }

    private Long id;
    private String startDateTime;
    private String endDateTime;
    private Integer personLimit;
    private List<String> additionalServices;
    private Double price;
    private Boolean active;
    private Long clientId;
    private Long bookableId;
    private Long ownerId;
    private String bookableName;
    private Address bookableAddress;
    private String ownerPhoneNumber;
    private Long reportId;
    private String bookableType;
    private Boolean reported;
    private Boolean ownerReviewed;
    private Boolean bookableReviewed;
    private final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private List<String> getStringAdditionalServices(List<Tag> services) {
        List<String> stringServices = new ArrayList<>();
        for (Tag tag: services) {
            stringServices.add(tag.getName());
        }
        return stringServices;
    }

    private String getBookableOwnerPhoneNum(Bookable bookable) {
        String phoneNumber = "";
        if (bookable instanceof Cottage) phoneNumber = ((Cottage) bookable).getCottageOwner().getPhoneNumber();
        else if (bookable instanceof Boat) phoneNumber = ((Boat) bookable).getBoatOwner().getPhoneNumber();
        else if (bookable instanceof Adventure) phoneNumber = ((Adventure) bookable).getInstructor().getPhoneNumber();
        return phoneNumber;
    }

    private Long getBookableOwnerId(Bookable bookable) {
        Long id = 0L;
        if (bookable instanceof Cottage) id = ((Cottage) bookable).getCottageOwner().getId();
        else if (bookable instanceof Boat) id = ((Boat) bookable).getBoatOwner().getId();
        else if (bookable instanceof Adventure) id = ((Adventure) bookable).getInstructor().getId();
        return id;
    }
}
