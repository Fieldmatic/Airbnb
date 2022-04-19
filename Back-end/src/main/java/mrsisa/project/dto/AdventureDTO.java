package mrsisa.project.dto;

import lombok.Data;
import mrsisa.project.model.Adventure;

import java.util.List;

@Data
public class AdventureDTO {

    private String adventureName;
    private String address;
    private String promoDescription;
    private Integer capacity;
    private String rules;
    private String equipment;
    private String cancelationConditions;
    private Integer hourlyRate;
    private String inputPictures;

}
