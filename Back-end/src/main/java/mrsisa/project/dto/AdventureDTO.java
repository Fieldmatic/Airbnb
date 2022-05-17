package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.Adventure;

import java.util.List;

@Data
@NoArgsConstructor
public class AdventureDTO {
    private Long id;
    private String name;
    private Address address;
    private String promotionalDescription;
    private Integer capacity;
    private String rules;
    private List<String> equipment;
    private String cancellationConditions;
    private Double hourlyRate;
    private Double rating;
    private List<String> photos;

    public AdventureDTO(Adventure adventure){
        this.id = adventure.getId();
        this.name = adventure.getName();
        this.address = adventure.getAddress();
        this.promotionalDescription = adventure.getPromotionalDescription();
        this.cancellationConditions = adventure.getPriceList().getCancellationConditions();
        this.rules = adventure.getRules();
        this.hourlyRate = adventure.getPriceList().getHourlyRate();
        this.capacity = adventure.getCapacity();
        this.equipment = adventure.getFishingEquipment();
        this.rating = adventure.getRating();
        this.photos = adventure.getPictures();
    }

}
