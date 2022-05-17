package mrsisa.project.controller;

import mrsisa.project.dto.ProfileDeletionReasonDTO;
import mrsisa.project.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    AdminService adminService;

    @PostMapping(path = "/deleteInstructor/{id}")
    public ResponseEntity<String> addAdventure(@RequestPart("data") ProfileDeletionReasonDTO pdrDTO, @PathVariable("id") Long id)
    {
        boolean isSent = adminService.sendRequestForProfileDeletion(id, pdrDTO);
        if (!isSent)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Check your password!");
        return ResponseEntity.status(HttpStatus.OK).body("Request for deleting account successfully sent!");
    }

}
