package mrsisa.project.repository;


import mrsisa.project.model.Period;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface PeriodRepository extends JpaRepository<Period, Long> {
    Period findPeriodByStartDateTimeIsLessThanEqualAndEndDateTimeIsGreaterThanEqual(LocalDateTime startDate, LocalDateTime endDate);
}
