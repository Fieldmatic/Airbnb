package mrsisa.project.controller;

import mrsisa.project.dto.ComplaintDTO;
import mrsisa.project.service.ClientService;
import mrsisa.project.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/complaint")
public class ComplaintController {
    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private ClientService clientService;

    @PostMapping(value = "/addComplaint")
    @PreAuthorize("hasAnyRole('CLIENT')")
    public ResponseEntity<String> addComplaint(@RequestBody ComplaintDTO complaintDTO) {
        if (complaintService.add(complaintDTO)) return ResponseEntity.status(HttpStatus.CREATED).body("Success");
        else return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Error");
    }
}
