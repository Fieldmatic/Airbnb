package mrsisa.project.dto;


import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.Boat;
import mrsisa.project.model.Tag;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class BoatDTO {
    public BoatDTO(Boat boat){
        this.id = boat.getId();
        this.name = boat.getName();
        this.address = boat.getAddress();
        this.promotionalDescription = boat.getPromotionalDescription();
        this.cancellationConditions = boat.getPriceList().getCancellationConditions();
        this.rules = boat.getRules();
        this.dailyRate = boat.getPriceList().getDailyRate();
        this.hourlyRate = boat.getPriceList().getHourlyRate();
        this.type = boat.getType().toString();
        this.rating = boat.getRating();
        this.enginesNumber = boat.getEnginesNumber();
        this.enginePower = boat.getEnginePower();
        this.maxSpeed = boat.getMaxSpeed();
        this.capacity = boat.getCapacity();
        this.navigationEquipment = boat.getNavigationEquipment();
        this.fishingEquipment = boat.getFishingEquipment();
        this.additionalServices = getStringAdditionalServices(boat.getAdditionalServices());
        this.photos = boat.getPictures();
    }
    private Long id;
    private String name;
    private Address address;
    private String promotionalDescription;
    private String cancellationConditions;
    private String rules;
    private Double dailyRate;
    private Double hourlyRate;
    private String type;
    private Double rating;
    private Integer enginesNumber;
    private Double enginePower;
    private Double maxSpeed;
    private Integer capacity;
    private List<String> navigationEquipment;
    private List<String> fishingEquipment;
    private List<String> photos;
    private List<String> additionalServices;

    private List<String> getStringAdditionalServices(List<Tag> services) {
        List<String> stringServices = new ArrayList<>();
        for (Tag tag: services) {
            stringServices.add(tag.getName());
        }
        return stringServices;
    }
}
