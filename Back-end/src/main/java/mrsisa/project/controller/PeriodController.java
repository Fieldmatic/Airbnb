package mrsisa.project.controller;
import mrsisa.project.dto.PeriodDTO;
import mrsisa.project.service.PeriodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("api/period")
public class PeriodController {

    @Autowired
    private PeriodService periodService;

    @PostMapping(value = "/add")
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER')")
    public ResponseEntity<String> addPeriod(@RequestBody PeriodDTO periodDTO) throws IOException {
        String answer = periodService.add(periodDTO);
        if (answer.equals("success")) return ResponseEntity.status(HttpStatus.CREATED).body("Success");
        else if (answer.equals("occupied")) return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Period already exists in given date range!");
        else return ResponseEntity.status(HttpStatus.OK).body("Existing period extended.");
    }
}

