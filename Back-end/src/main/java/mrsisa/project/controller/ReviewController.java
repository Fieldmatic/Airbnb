package mrsisa.project.controller;


import mrsisa.project.dto.CottageDTO;
import mrsisa.project.dto.ReviewDTO;
import mrsisa.project.model.Administrator;
import mrsisa.project.model.Review;
import mrsisa.project.service.AdminService;
import mrsisa.project.service.ClientService;
import mrsisa.project.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;


@RestController
@RequestMapping("api/review")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ClientService clientService;

    @Autowired
    private AdminService adminService;

    @PostMapping(value = "/addReview")
    @PreAuthorize("hasAnyRole('CLIENT')")
    public ResponseEntity<String> addReview(@RequestBody ReviewDTO reviewDTO) {
        if (reviewService.add(reviewDTO)) return ResponseEntity.status(HttpStatus.CREATED).body("Success");
        else return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Error");
    }

    @GetMapping(value = "/getAllReviews")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ReviewDTO>> getAllReviews(Principal userP) {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        List<ReviewDTO> list = reviewService.getAllReviews();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PutMapping(value = "/approveReview/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> approveReview(@PathVariable Long id, @RequestBody String body, Principal userP)
    {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        Review review = reviewService.findReviewById(id);
        if (review == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error! Review not found.");
        reviewService.acceptReview(review);
        return ResponseEntity.status(HttpStatus.OK).body("Email sent!");
    }

    @PutMapping(value = "/denyReview/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> denyReview(@PathVariable Long id, @RequestBody String body, Principal userP)
    {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        Review review = reviewService.findReviewById(id);
        if (review == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error! Review not found.");
        reviewService.denyReview(review);
        return ResponseEntity.status(HttpStatus.OK).body("Review denied!");
    }

    @GetMapping(value="/getBookableReviews/{id}")
    public ResponseEntity<List<ReviewDTO>> getBookableReviews(@PathVariable("id") Long id) {
        List<ReviewDTO> reviewsDTO = reviewService.findBookableReviews(id);
        return new ResponseEntity<>(reviewsDTO, HttpStatus.OK);
    }
}
