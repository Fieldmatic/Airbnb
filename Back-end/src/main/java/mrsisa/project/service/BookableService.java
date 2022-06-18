package mrsisa.project.service;


import mrsisa.project.dto.BookableCalendarDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.BookableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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
                        "ACTION", action.getStartDateTime().toString(), action.getEndDateTime().toString(), "#008383", null));
            }
        }
        return calendarDTOS;
    }

    private List<BookableCalendarDTO> getBookableReserved(List<BookableCalendarDTO> calendarDTOS, Bookable bookable) {
        for (Reservation reservation : bookable.getReservations()) {
            String client = reservation.getClient().getName() + " " + reservation.getClient().getSurname() + " (" +
                    reservation.getClient().getUsername() + ")";
            calendarDTOS.add(new BookableCalendarDTO(
                    "RESERVED", reservation.getStartDateTime().toString(), reservation.getEndDateTime().toString(), "#870000", client));
        }
        return calendarDTOS;
    }

    private List<BookableCalendarDTO> getBookableAvailable(List<BookableCalendarDTO> calendarDTOS, Bookable bookable) {
        for (Period period : bookable.getPeriods()) {
            calendarDTOS.add(new BookableCalendarDTO(
                    "AVAILABLE", period.getStartDateTime().toString(), period.getEndDateTime().toString(), "#0f5e06", null));
        }
        return calendarDTOS;
    }
}
