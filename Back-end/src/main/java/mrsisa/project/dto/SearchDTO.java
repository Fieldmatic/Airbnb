package mrsisa.project.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class SearchDTO {
    private String startDate;
    private String endDate;
    private String city;
    private Integer capacity;

}
