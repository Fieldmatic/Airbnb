package mrsisa.project.controller;


import mrsisa.project.dto.ReportDTO;
import mrsisa.project.dto.ReviewDTO;
import mrsisa.project.model.Client;
import mrsisa.project.service.ClientService;
import mrsisa.project.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("api/review")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ClientService clientService;

    @PostMapping(value = "/addReview")
    @PreAuthorize("hasAnyRole('CLIENT')")
    public ResponseEntity<String> addReview(@RequestBody ReviewDTO reviewDTO) {
        if (reviewService.add(reviewDTO)) return ResponseEntity.status(HttpStatus.CREATED).body("Success");
        else return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Error");
    }

}
