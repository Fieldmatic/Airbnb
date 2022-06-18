package mrsisa.project.controller;
import mrsisa.project.dto.PeriodDTO;
import mrsisa.project.dto.ReservationStatisticsDTO;
import mrsisa.project.dto.UserDetailsDTO;
import mrsisa.project.model.*;
import mrsisa.project.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("api/owner")
public class OwnerController {

    @Autowired
    UserService userService;

    @Autowired
    CottageOwnerService cottageOwnerService;

    @Autowired
    BoatOwnerService boatOwnerService;

    @Autowired
    BookableService bookableService;

    @Autowired
    InstructorService instructorService;


    @GetMapping("/get")
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER')")
    public ResponseEntity<UserDetailsDTO> getOwner(Principal userP) {
        Person owner = this.userService.getByUsername(userP.getName());
        return new ResponseEntity<>(new UserDetailsDTO(owner), HttpStatus.OK);
    }

    @GetMapping(value="/getProfilePicture", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER')")
    public ResponseEntity<InputStreamResource> getProfilePicture(Principal userP) throws IOException {
        Person owner = userService.getByUsername(userP.getName());
        try {
            File file = new File(owner.getProfilePhoto());
            return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(file.toPath())), HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(Paths.get("src/main/resources/static/pictures/defaults/default-profile-picture.jpg"))),HttpStatus.OK);
        }
    }

    @GetMapping(value = "/averageRating")
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER')")
    public ResponseEntity<Double> getAverageRating(Principal userP) {
        Role role = userService.getByUsername(userP.getName()).getRoles().get(0);
        Double rating = 0.0;
        switch (role.getName()){
            case "ROLE_COTTAGE_OWNER" :
                CottageOwner cottageOwner = cottageOwnerService.findCottageOwnerByUsername(userP.getName());
                for(Cottage cottage : cottageOwner.getCottages()) rating += cottage.getRating();
                return new ResponseEntity<>(rating / cottageOwner.getCottages().size(), HttpStatus.OK);

            case "ROLE_BOAT_OWNER" :
                BoatOwner boatOwner = boatOwnerService.findBoatOwnerByUsername(userP.getName());
                for(Boat boat : boatOwner.getBoats()) rating += boat.getRating();
                return new ResponseEntity<>(rating / boatOwner.getBoats().size(), HttpStatus.OK);
            default: return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

    @GetMapping(value = {"/reservationsStatistics","/reservationsStatistics/{bookable_id}"})
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_INSTRUCTOR')")
    public ResponseEntity<ReservationStatisticsDTO> getReservationStatistics(Principal userP, @PathVariable(required = false) Long bookable_id) {
        Role role = userService.getByUsername(userP.getName()).getRoles().get(0);
        switch (role.getName()){
            case "ROLE_COTTAGE_OWNER" :
                if (bookable_id != null) return new ResponseEntity<>(cottageOwnerService.getReservationStatistics(userP, Optional.of(bookable_id)), HttpStatus.OK);
                else return new ResponseEntity<>(cottageOwnerService.getReservationStatistics(userP, Optional.empty()), HttpStatus.OK);
            case "ROLE_BOAT_OWNER" :
                if (bookable_id != null) return new ResponseEntity<>(boatOwnerService.getReservationStatistics(userP, Optional.of(bookable_id)), HttpStatus.OK);
                else return new ResponseEntity<>(boatOwnerService.getReservationStatistics(userP, Optional.empty()), HttpStatus.OK);
            case "ROLE_INSTRUCTOR":
                if (bookable_id != null) return new ResponseEntity<>(instructorService.getReservationStatistics(userP, Optional.of(bookable_id)), HttpStatus.OK);
                else return new ResponseEntity<>(instructorService.getReservationStatistics(userP, Optional.empty()), HttpStatus.OK);
                default: return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = {"/incomeStatistics/{startDateTime}/{endDateTime}","/incomeStatistics/{startDateTime}/{endDateTime}/{bookable_id}"})
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_INSTRUCTOR')")
    public ResponseEntity<Map<String, Double>> getIncomeStatisticsInPeriod(@PathVariable(name = "startDateTime") String startISOString,@PathVariable(name = "endDateTime") String endISOString,@PathVariable(required = false) Long bookable_id,  Principal userP) throws IOException {
        Role role = userService.getByUsername(userP.getName()).getRoles().get(0);
        LocalDateTime start = LocalDateTime.ofInstant(Instant.parse(startISOString), ZoneOffset.UTC);
        LocalDateTime end = LocalDateTime.ofInstant(Instant.parse(endISOString), ZoneOffset.UTC);
        switch (role.getName()){
            case "ROLE_COTTAGE_OWNER" :
                if (bookable_id != null) return new ResponseEntity<>(cottageOwnerService.getIncomeStatistics(start,end,userP, Optional.of(bookable_id)), HttpStatus.OK);
                else return new ResponseEntity<>(cottageOwnerService.getIncomeStatistics(start,end,userP,Optional.empty()), HttpStatus.OK);
            case "ROLE_BOAT_OWNER" :
                if (bookable_id != null) return new ResponseEntity<>(boatOwnerService.getIncomeStatistics(start,end,userP, Optional.of(bookable_id)), HttpStatus.OK);
                else return new ResponseEntity<>(boatOwnerService.getIncomeStatistics(start,end,userP,Optional.empty()), HttpStatus.OK);
            case "ROLE_INSTRUCTOR":
                if (bookable_id != null) return new ResponseEntity<>(instructorService.getIncomeStatistics(start,end,userP, Optional.of(bookable_id)), HttpStatus.OK);
                else return new ResponseEntity<>(instructorService.getIncomeStatistics(start,end,userP,Optional.empty()), HttpStatus.OK);
            default: return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


}
