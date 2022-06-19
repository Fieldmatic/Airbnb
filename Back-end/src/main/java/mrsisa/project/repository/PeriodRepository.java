package mrsisa.project.repository;


import mrsisa.project.model.Period;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PeriodRepository extends JpaRepository<Period, Long> {
    Period findPeriodByStartDateTimeIsLessThanEqualAndEndDateTimeIsGreaterThanEqualAndBookable_Id(LocalDateTime startDate, LocalDateTime endDate, Long id);
    @Query("select p from Period p where p.bookable.id =?1 and p.startDateTime <= ?2 and p.endDateTime >=?3")
    Optional<Period> findPeriodByBookableIdAndStartBeforeOrEqualAndEndAfterOrEqual(Long id, LocalDateTime start, LocalDateTime end);

    Optional<Period> findPeriodByBookableIdAndStartDateTimeLessThanEqualAndEndDateTimeGreaterThanEqual(Long id, LocalDateTime start, LocalDateTime end);

}
