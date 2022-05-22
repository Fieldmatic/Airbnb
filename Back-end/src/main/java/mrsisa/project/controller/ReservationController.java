package mrsisa.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import mrsisa.project.dto.CottageDTO;
import mrsisa.project.dto.ReservationDTO;
import mrsisa.project.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("api/reservation")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;


    @PostMapping(value = "/addQuick")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<String> addQuickReservation(@RequestBody String actionId, Principal userP) throws IOException {
        reservationService.add(Long.parseLong(actionId.replace("=","")), userP);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }
}
