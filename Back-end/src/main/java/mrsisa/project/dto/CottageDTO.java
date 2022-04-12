package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class CottageDTO {
    private String name;
    private String address;
    private String promotionalDescription;
    private String cancellationConditions;
    private String rules;
    private Double dailyRate;
    private Double hourlyRate;
}
