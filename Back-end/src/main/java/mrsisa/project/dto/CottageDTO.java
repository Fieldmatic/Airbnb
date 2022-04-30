package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.Cottage;


@Data
@NoArgsConstructor
public class CottageDTO {
    public CottageDTO(Cottage cottage){
        this.name = cottage.getName();
        this.address = cottage.getAddress();
        this.promotionalDescription = cottage.getPromotionalDescription();
        this.cancellationConditions = cottage.getPriceList().getCancellationConditions();
        this.rules = cottage.getRules();
        this.dailyRate = cottage.getPriceList().getDailyRate();
        this.hourlyRate = cottage.getPriceList().getHourlyRate();
        this.singleRooms = cottage.getRooms().get(1) != null ? cottage.getRooms().get(1) : 0;
        this.doubleRooms = cottage.getRooms().get(2) != null ? cottage.getRooms().get(2) : 0;
        this.tripleRooms = cottage.getRooms().get(3) != null ? cottage.getRooms().get(3) : 0;
        this.quadRooms = cottage.getRooms().get(4) != null ? cottage.getRooms().get(4) : 0;
    }
    private String name;
    private Address address;
    private String promotionalDescription;
    private String cancellationConditions;
    private String rules;
    private Double dailyRate;
    private Double hourlyRate;
    private Integer singleRooms;
    private Integer doubleRooms;
    private Integer tripleRooms;
    private Integer quadRooms;
}
