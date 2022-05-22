package mrsisa.project.service;
import mrsisa.project.dto.PeriodDTO;
import mrsisa.project.model.Action;
import mrsisa.project.model.Bookable;
import mrsisa.project.model.Period;
import mrsisa.project.repository.BookableRepository;
import mrsisa.project.repository.PeriodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class PeriodService {
    @Autowired
    private BookableRepository bookableRepository;

    @Autowired
    private PeriodRepository periodRepository;

    @Transactional
    public String add(PeriodDTO periodDTO) throws IOException {
        Period period = dtoToPeriod(periodDTO);
        Bookable bookable = bookableRepository.getById(periodDTO.getBookableId());
        String answer = checkPeriodMatching(period.getStartDateTime(), period.getEndDateTime(), bookable);
        if (answer.equals("available")) {
            period.setBookable(bookable);
            bookable.getPeriods().add(period);
            bookableRepository.save(bookable);
            return "success";
        }
        return answer;
    }

    private String checkPeriodMatching(LocalDateTime start, LocalDateTime end, Bookable bookable) {
        for (Period period : bookable.getPeriods()) {
            if (start.isEqual(period.getStartDateTime()) && end.isEqual(period.getEndDateTime()))
                return "occupied";
            if (start.isAfter(period.getStartDateTime()) && end.isBefore(period.getEndDateTime()))
                return "occupied";
            if (start.isEqual(period.getStartDateTime()) && end.isBefore(period.getEndDateTime())) {
                return "occupied";
            }
            if (end.isEqual(period.getEndDateTime()) && start.isAfter(period.getStartDateTime())) {
                return "occupied";
            }
            if (start.isBefore(period.getStartDateTime()) && end.isAfter(period.getEndDateTime())) {
                extendPeriod(period,start,end);
                return "extended";
            }
            if (start.isBefore(period.getStartDateTime()) && end.isBefore(period.getEndDateTime()) && end.isAfter(period.getStartDateTime())) {
                extendPeriod(period,start,period.getEndDateTime());
                return "extended";
            }
            if (start.isAfter(period.getStartDateTime()) && start.isBefore(period.getEndDateTime()) && end.isAfter(period.getEndDateTime())) {
                extendPeriod(period,period.getStartDateTime(),end);
                return "extended";
            }
            if (start.isEqual(period.getEndDateTime()) && end.isAfter(period.getEndDateTime())) {
                extendPeriod(period,period.getStartDateTime(),end);
                return "extended";
            }
            if (start.isEqual(period.getStartDateTime()) && end.isAfter(period.getEndDateTime())) {
                extendPeriod(period,period.getStartDateTime(),end);
                return "extended";
            }
            if (end.isEqual(period.getEndDateTime()) && start.isBefore(period.getStartDateTime())) {
                extendPeriod(period,start,period.getEndDateTime());
                return "extended";
            }
            if (end.isEqual(period.getStartDateTime()) && start.isBefore(period.getStartDateTime())) {
                extendPeriod(period, start, period.getEndDateTime());
                return "extended";
            }
        }
        return "available";
    }

    private void extendPeriod(Period period,LocalDateTime start, LocalDateTime end){
        period.setStartDateTime(start);
        period.setEndDateTime(end);
        periodRepository.save(period);
    }


    private Period dtoToPeriod(PeriodDTO periodDTO){
        Period period = new Period();
        period.setStartDateTime(LocalDateTime.ofInstant(Instant.parse(periodDTO.getStartDateTime()), ZoneOffset.UTC));
        period.setEndDateTime(LocalDateTime.ofInstant(Instant.parse(periodDTO.getEndDateTime()), ZoneOffset.UTC));
        return period;
    }
}
