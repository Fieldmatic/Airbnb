package mrsisa.project.controller;
import mrsisa.project.dto.PeriodDTO;
import mrsisa.project.dto.ReservationStatisticsDTO;
import mrsisa.project.dto.UserDetailsDTO;
import mrsisa.project.model.*;
import mrsisa.project.service.BoatOwnerService;
import mrsisa.project.service.CottageOwnerService;
import mrsisa.project.service.UserService;
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
import java.security.Principal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;

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
        File file = new File(owner.getProfilePhoto());
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        return new ResponseEntity<>(resource, HttpStatus.OK);
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

    @GetMapping(value = "/reservationsStatistics")
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER')")
    public ResponseEntity<ReservationStatisticsDTO> getReservationStatistics(Principal userP) {
        Role role = userService.getByUsername(userP.getName()).getRoles().get(0);
        switch (role.getName()){
            case "ROLE_COTTAGE_OWNER" :
                return new ResponseEntity<>(cottageOwnerService.getReservationStatistics(userP), HttpStatus.OK);

            case "ROLE_BOAT_OWNER" :
                return new ResponseEntity<>(boatOwnerService.getReservationStatistics(userP), HttpStatus.OK);
            default: return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/incomeStatistics/{startDateTime}/{endDateTime}")
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER')")
    public ResponseEntity<Map<String, Double>> getIncomeStatisticsInPeriod(@PathVariable(name = "startDateTime") String startISOString,@PathVariable(name = "endDateTime") String endISOString, Principal userP) throws IOException {
        Role role = userService.getByUsername(userP.getName()).getRoles().get(0);
        LocalDateTime start = LocalDateTime.ofInstant(Instant.parse(startISOString), ZoneOffset.UTC);
        LocalDateTime end = LocalDateTime.ofInstant(Instant.parse(endISOString), ZoneOffset.UTC);
        switch (role.getName()){
            case "ROLE_COTTAGE_OWNER" :
                return new ResponseEntity<>(cottageOwnerService.getIncomeStatistics(start,end,userP), HttpStatus.OK);
            case "ROLE_BOAT_OWNER" :
                return new ResponseEntity<>(boatOwnerService.getIncomeStatistics(start,end,userP), HttpStatus.OK);
            default: return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


}
