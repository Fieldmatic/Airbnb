package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.Adventure;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class AdventureDTO {
    private Long id;
    private String name;
    private Address address;
    private String promoDescription;
    private Integer capacity;
    private String rules;
    private List<String> equipment;
    private String cancellationConditions;
    private Double hourlyRate;
    private Double rating;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    /*
        sledece 2 promjenljive se koriste za dobavljanje datuma i vremena sa fronta, a u nastavku se koriste
        promjenjljive iznad
     */
    private String startDateTime;
    private String endDateTime;

    public AdventureDTO(Adventure adventure){
        this.id = adventure.getId();
        this.name = adventure.getName();
        this.address = adventure.getAddress();
        this.promoDescription = adventure.getPromotionalDescription();
        this.cancellationConditions = adventure.getPriceList().getCancellationConditions();
        this.rules = adventure.getRules();
        this.hourlyRate = adventure.getPriceList().getHourlyRate();
        this.capacity = adventure.getCapacity();
        this.equipment = adventure.getFishingEquipment();
        this.rating = adventure.getRating();
        this.startDate = adventure.getBusyPeriods().getStartDateTime();
        this.endDate = adventure.getBusyPeriods().getEndDateTime();
    }

}
