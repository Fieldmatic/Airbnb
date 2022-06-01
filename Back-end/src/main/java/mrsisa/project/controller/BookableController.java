package mrsisa.project.controller;


import mrsisa.project.dto.BookableCalendarDTO;
import mrsisa.project.model.Bookable;
import mrsisa.project.service.BookableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/bookable")
public class BookableController {

    @Autowired
    private BookableService bookableService;

    @GetMapping(value="/getBookableAvailable/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'BOAT_OWNER', 'COTTAGE_OWNER')")
    public ResponseEntity<List<BookableCalendarDTO>> getBookableAvailable(@PathVariable("id") Long id) {
        List<BookableCalendarDTO> calendarDTOS = bookableService.getBookableEvents(1, id);
        return new ResponseEntity<>(calendarDTOS, HttpStatus.OK);
    }

    @GetMapping(value="/getBookableReservations/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'BOAT_OWNER', 'COTTAGE_OWNER')")
    public ResponseEntity<List<BookableCalendarDTO>> getBookableReservations(@PathVariable("id") Long id) {
        List<BookableCalendarDTO> calendarDTOS = bookableService.getBookableEvents(2, id);
        return new ResponseEntity<>(calendarDTOS, HttpStatus.OK);
    }

    @GetMapping(value="/getBookableActions/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'BOAT_OWNER', 'COTTAGE_OWNER')")
    public ResponseEntity<List<BookableCalendarDTO>> getBookableActions(@PathVariable("id") Long id) {
        List<BookableCalendarDTO> calendarDTOS = bookableService.getBookableEvents(3, id);
        return new ResponseEntity<>(calendarDTOS, HttpStatus.OK);
    }
}
