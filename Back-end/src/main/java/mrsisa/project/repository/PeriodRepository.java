package mrsisa.project.repository;

import mrsisa.project.model.Period;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface PeriodRepository extends JpaRepository<Period, Long> {
}
