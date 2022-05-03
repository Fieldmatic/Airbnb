package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.Adventure;
import mrsisa.project.model.Cottage;

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
    }

}
