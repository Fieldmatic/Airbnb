package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SearchDTO {
    private String startDate;
    private String endDate;
    private String city;
    private Integer capacity;

}
