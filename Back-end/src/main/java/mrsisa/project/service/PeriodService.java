package mrsisa.project.service;
import mrsisa.project.dto.PeriodDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.BookableRepository;
import mrsisa.project.repository.PeriodRepository;
import org.apache.tomcat.jni.Local;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PeriodService {
    @Autowired
    private BookableRepository bookableRepository;

    @Autowired
    private PeriodRepository periodRepository;

    @Transactional
    public void createPeriodForCottage(Cottage cottage) {

        Period period = new Period();
        period.setStartDateTime(LocalDateTime.now());
        period.setEndDateTime(LocalDateTime.now().plusDays(20));
        period.setBookable(cottage);

        Bookable bookable = bookableRepository.getById(cottage.getId());
        bookable.getPeriods().add(period);
        periodRepository.save(period);
    }

    @Transactional
    public String add(PeriodDTO periodDTO) {
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

    public void splitPeriodAfterReservation(Reservation reservation)  {
        Period firstPeriod = periodRepository.findPeriodByStartDateTimeIsLessThanEqualAndEndDateTimeIsGreaterThanEqualAndBookable_Id(reservation.getStartDateTime(), reservation.getEndDateTime(), reservation.getBookable().getId());

        if (diffBetweenDatesMoreThanHour(firstPeriod.getStartDateTime(), reservation.getStartDateTime())) {
            if (diffBetweenDatesMoreThanHour(reservation.getEndDateTime(), firstPeriod.getEndDateTime())) {
                Period secondPeriod = new Period();
                secondPeriod.setStartDateTime(reservation.getEndDateTime());
                secondPeriod.setEndDateTime(firstPeriod.getEndDateTime());
                secondPeriod.setBookable(firstPeriod.getBookable());
                reservation.getBookable().getPeriods().add(secondPeriod);
                extendPeriod(secondPeriod, reservation.getEndDateTime(), firstPeriod.getEndDateTime());
            }
            extendPeriod(firstPeriod, firstPeriod.getStartDateTime(), reservation.getStartDateTime());
        }
        else
            periodRepository.delete(firstPeriod);
    }

    private boolean diffBetweenDatesMoreThanHour(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        return Duration.between(startDateTime, endDateTime).toHours() >= 1;
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
