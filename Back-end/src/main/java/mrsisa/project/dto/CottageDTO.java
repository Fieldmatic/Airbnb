package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Address;
import mrsisa.project.model.Cottage;
import mrsisa.project.model.Tag;

import java.util.ArrayList;
import java.util.List;


@Data
@NoArgsConstructor
public class CottageDTO {
    public CottageDTO(Cottage cottage, List<Tag> additionalServices){
        this.id = cottage.getId();
        this.name = cottage.getName();
        this.address = cottage.getAddress();
        this.promotionalDescription = cottage.getPromotionalDescription();
        this.cancellationConditions = cottage.getPriceList().getCancellationConditions();
        this.rules = cottage.getRules();
        this.rating = cottage.getRating();
        this.dailyRate = cottage.getPriceList().getDailyRate();
        this.hourlyRate = cottage.getPriceList().getHourlyRate();
        this.capacity = cottage.getCapacity();
        this.singleRooms = cottage.getRooms().get(1) != null ? cottage.getRooms().get(1) : 0;
        this.doubleRooms = cottage.getRooms().get(2) != null ? cottage.getRooms().get(2) : 0;
        this.tripleRooms = cottage.getRooms().get(3) != null ? cottage.getRooms().get(3) : 0;
        this.quadRooms = cottage.getRooms().get(4) != null ? cottage.getRooms().get(4) : 0;
        this.additionalServices = getStringAdditionalServices(additionalServices);
        this.photos = cottage.getPictures();
    }
    private Long id;
    private String name;
    private Address address;
    private String promotionalDescription;
    private String cancellationConditions;
    private Integer capacity;
    private String rules;
    private Double dailyRate;
    private Double hourlyRate;
    private Double rating;
    private Integer singleRooms;
    private Integer doubleRooms;
    private Integer tripleRooms;
    private Integer quadRooms;
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
