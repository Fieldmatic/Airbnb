package mrsisa.project.dto;

import mrsisa.project.model.Bookable;
import mrsisa.project.model.Client;
import mrsisa.project.model.Tag;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

public class ReservationDTO {

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
}
