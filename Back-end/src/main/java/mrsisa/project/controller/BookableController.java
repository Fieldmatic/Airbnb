package mrsisa.project.controller;


import mrsisa.project.dto.BookableCalendarDTO;
import mrsisa.project.model.Bookable;
import mrsisa.project.service.BookableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

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

    @GetMapping(value="/getServices/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'BOAT_OWNER', 'COTTAGE_OWNER')")
    public ResponseEntity<List<String>> getBookableServices(@PathVariable("id") Long id){
        return new ResponseEntity<>(bookableService.getBookableAdditionalServices(id),HttpStatus.OK);
    }

    @GetMapping(value="/getBookableActions/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'BOAT_OWNER', 'COTTAGE_OWNER')")
    public ResponseEntity<List<BookableCalendarDTO>> getBookableActions(@PathVariable("id") Long id) {
        List<BookableCalendarDTO> calendarDTOS = bookableService.getBookableEvents(3, id);
        return new ResponseEntity<>(calendarDTOS, HttpStatus.OK);
    }

    @GetMapping(value="/getProfilePicture/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public ResponseEntity<InputStreamResource> getBookableProfilePicture(@PathVariable Long id) throws IOException {
        Bookable bookable = bookableService.findOne(id);
        try {
            File file = new File(bookable.getProfilePicture());
            return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(file.toPath())), HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(Paths.get("src/main/resources/static/pictures/defaults/noPhotoAvailable.jpeg"))),HttpStatus.OK);
        }
    }

    @GetMapping(value = "/rating/{bookable_id}")
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_INSTRUCTOR')")
    public ResponseEntity<Double> getRating(@PathVariable Long bookable_id) {
         Bookable bookable = bookableService.findOne(bookable_id);
         return new ResponseEntity<>(bookable.getRating(), HttpStatus.OK);
    }
}
