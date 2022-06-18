package mrsisa.project.service;


import mrsisa.project.dto.BookableCalendarDTO;
import mrsisa.project.dto.ReservationStatisticsDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.BookableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BookableService {

    @Autowired
    public BookableRepository bookableRepository;

    public List<Bookable> findAll() {
        return bookableRepository.findAll();
    }

    @Transactional
    public Bookable findById(Long id) {
        return bookableRepository.findById(id).orElse(null);
    }

    public Bookable findOne(Long id) {
        return bookableRepository.findById(id).orElse(null);
    }

    @Transactional
    public List<BookableCalendarDTO> getBookableEvents(int type, Long id) {
        List<BookableCalendarDTO> calendarDTOS = new ArrayList<>();
        Bookable bookable = findById(id);
        if (type == 1) {
            return getBookableAvailable(calendarDTOS, bookable);
        } else if (type == 2) {
            return getBookableReserved(calendarDTOS, bookable);
        } else {
            return getBookableActions(calendarDTOS, bookable);
        }
    }

    private List<BookableCalendarDTO> getBookableActions(List<BookableCalendarDTO> calendarDTOS, Bookable bookable) {
        for (Action action : bookable.getActions()) {
            if (!action.getUsed()) {
                calendarDTOS.add(new BookableCalendarDTO(
                        "ACTION", action.getStartDateTime().toString(), action.getEndDateTime().toString(), "#008383"));
            }
        }
        return calendarDTOS;
    }

    private List<BookableCalendarDTO> getBookableReserved(List<BookableCalendarDTO> calendarDTOS, Bookable bookable) {
        for (Reservation reservation : bookable.getReservations()) {
            calendarDTOS.add(new BookableCalendarDTO(
                    "RESERVED", reservation.getStartDateTime().toString(), reservation.getEndDateTime().toString(), "#870000"));
        }
        return calendarDTOS;
    }

    private List<BookableCalendarDTO> getBookableAvailable(List<BookableCalendarDTO> calendarDTOS, Bookable bookable) {
        for (Period period : bookable.getPeriods()) {
            calendarDTOS.add(new BookableCalendarDTO(
                    "AVAILABLE", period.getStartDateTime().toString(), period.getEndDateTime().toString(), "#0f5e06"));
        }
        return calendarDTOS;
    }

    public void fillBookableReservationStatistics(Long bookableId, ReservationStatisticsDTO statistics) {
        List<Reservation> reservations = bookableRepository.getById(bookableId).getReservations();
        for (Reservation reservation : reservations) {
            if (!reservation.getActive()) {
                String year = String.valueOf(reservation.getEndDateTime().getYear());
                String month = String.valueOf(reservation.getEndDateTime().getMonth());
                String week = String.valueOf(calcNextMonday(reservation.getEndDateTime()));
                if (!statistics.getYearlyStatistics().containsKey(year)) statistics.getYearlyStatistics().put(year, 1);
                else statistics.getYearlyStatistics().put(year, statistics.getYearlyStatistics().get(year) + 1);
                if (!statistics.getMonthlyStatistics().containsKey(month))
                    statistics.getMonthlyStatistics().put(month, 1);
                else statistics.getMonthlyStatistics().put(month, statistics.getMonthlyStatistics().get(month) + 1);
                if (!statistics.getWeeklyStatistics().containsKey(week)) statistics.getWeeklyStatistics().put(week, 1);
                else statistics.getWeeklyStatistics().put(week, statistics.getWeeklyStatistics().get(week) + 1);
            }
        }
    }

    public void fillBookableIncomeStatistics(LocalDateTime start, LocalDateTime end, Map<String, Double> incomeByCottage, Long bookableId) {
        Bookable bookable = bookableRepository.getById(bookableId);
        for (Reservation reservation : bookable.getReservations()) {
            if (reservation.getEndDateTime().isAfter(start) && reservation.getEndDateTime().isBefore(end) && !reservation.getActive()) {
                if (!incomeByCottage.containsKey(bookable.getName()))
                    incomeByCottage.put(bookable.getName(), reservation.getPrice());
                else
                    incomeByCottage.put(bookable.getName(), incomeByCottage.get(bookable.getName()) + reservation.getPrice());
            }
        }
    }

    private LocalDateTime calcNextMonday(LocalDateTime dateTime) {
        return dateTime.with(TemporalAdjusters.previous(DayOfWeek.MONDAY));
    }

}
