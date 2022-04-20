package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Adventure;

import java.util.List;

@Data
@NoArgsConstructor
public class AdventureDTO {

    private String name;
    private String address;
    private String promoDescription;
    private Integer capacity;
    private String rules;
    private String equipment;
    private String cancellationConditions;
    private Double hourlyRate;
    private String inputPictures;

    public AdventureDTO(Adventure adventure){
        this.name = adventure.getName();
        this.address = adventure.getAddress();
        this.promoDescription = adventure.getPromotionalDescription();
        this.cancellationConditions = adventure.getPriceList().getCancellationConditions();
        this.rules = adventure.getRules();
        this.hourlyRate = adventure.getPriceList().getHourlyRate();
        this.capacity = adventure.getCapacity();
//        this.equipment = adventure.getFishingEquipment();
    }

}
