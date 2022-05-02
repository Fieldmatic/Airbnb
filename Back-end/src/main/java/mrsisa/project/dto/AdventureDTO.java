package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Adventure;
import mrsisa.project.model.Cottage;

import java.util.List;

@Data
@NoArgsConstructor
public class AdventureDTO {

    private String adventureName;
    private String address;
    private String promoDescription;
    private Integer capacity;
    private String rules;
    private String equipment;
    private String cancelationConditions;
    private Double hourlyRate;
    private Double dailyRate;
    private String inputPictures;
    private Double rating;

    public AdventureDTO(Adventure adventure){
        this.adventureName = adventure.getName();
        this.address = adventure.getAddress();
        this.promoDescription = adventure.getPromotionalDescription();
        this.cancelationConditions = adventure.getPriceList().getCancellationConditions();
        this.rules = adventure.getRules();
        this.rating = adventure.getRating();
        this.dailyRate = adventure.getPriceList().getDailyRate();
        this.hourlyRate = adventure.getPriceList().getHourlyRate();
    }

}
