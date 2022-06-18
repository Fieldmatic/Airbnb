package mrsisa.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import mrsisa.project.dto.BoatDTO;
import mrsisa.project.dto.CottageDTO;
import mrsisa.project.dto.ReservationDTO;
import mrsisa.project.model.Client;
import mrsisa.project.service.ClientService;
import mrsisa.project.service.ReservationService;
import mrsisa.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/reservation")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ClientService clientService;

    @PostMapping(value = "/addQuick")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<String> addQuickReservation(@RequestBody String actionId, Principal userP) throws IOException {
        if (reservationService.addQuick(Long.parseLong(actionId.replace("=","")), userP)) return ResponseEntity.status(HttpStatus.CREATED).body("Success");
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Failed");
    }

    @PostMapping(value = "/add")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<String> addReservation(@RequestBody ReservationDTO dto, Principal userP) throws IOException {
        Client client = clientService.findClientByUsername(userP.getName());
        if (reservationService.add(dto, client)) return ResponseEntity.status(HttpStatus.CREATED).body("Success");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("That period is unavailable!");
    }

    @PostMapping(value = "/reserveForClient/{email}")
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_INSTRUCTOR')")
    public ResponseEntity<String> reserveForClient(@RequestBody ReservationDTO dto, @PathVariable("email") String email) throws IOException {
        Client client = clientService.findClientByEmail(email);
        if (reservationService.add(dto, client)) return ResponseEntity.status(HttpStatus.CREATED).body("Success");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("That period is unavailable!");
    }

    @GetMapping(value = "/getReservations")
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_INSTRUCTOR','ROLE_CLIENT')")
    public ResponseEntity<List<ReservationDTO>> getReservations(Principal userP) throws IOException {
        return ResponseEntity.status(HttpStatus.OK).body(reservationService.getReservations(userP));
    }
}
