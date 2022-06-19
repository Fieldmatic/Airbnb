package mrsisa.project.dto;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class ReservationStatisticsDTO {
    private Map<String, Integer> weeklyStatistics;
    private Map<String, Integer> monthlyStatistics;
    private Map<String, Integer> yearlyStatistics;

    public ReservationStatisticsDTO() {
        weeklyStatistics = new HashMap<>();
        monthlyStatistics = new HashMap<>();
        yearlyStatistics = new HashMap<>();
    }
}
