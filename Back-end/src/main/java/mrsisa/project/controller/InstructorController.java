package mrsisa.project.controller;


import mrsisa.project.dto.InstructorDTO;
import mrsisa.project.dto.ProfileDeletionReasonDTO;
import mrsisa.project.model.Instructor;
import mrsisa.project.service.AddressService;
import mrsisa.project.service.InstructorService;
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

@RestController
@RequestMapping("api/instructor")
public class InstructorController {

    @Autowired
    private InstructorService instructorService;


    @PutMapping(value = "/update")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<InstructorDTO> updateInstructor(@RequestBody InstructorDTO dto)
    {
        Instructor instructor = instructorService.update(dto);
        if (instructor == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new InstructorDTO(instructor), HttpStatus.OK);
    }

    @GetMapping(value = "/get")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<InstructorDTO> getInstructor(Principal userP){
        return new ResponseEntity<>(new InstructorDTO(instructorService.findInstructorByUsername(userP.getName())), HttpStatus.OK);
    }

    @GetMapping(value="/getProfilePicture", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<InputStreamResource> getInstructorProfilePicture(Principal userP) throws IOException {
        Instructor instructor = instructorService.findInstructorByUsername(userP.getName());
        try {
            File file = new File(instructor.getProfilePhoto());
            return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(file.toPath())), HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(Paths.get("src/main/resources/static/pictures/defaults/default-profile-picture.jpg"))),HttpStatus.OK);
        }
    }

    @PostMapping(path = "/sendDeletionRequest")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<String> sendRequestForProfileDeletion(@RequestPart("data") ProfileDeletionReasonDTO pdrDTO, Principal userP)
    {
        boolean isSent = instructorService.sendProfileDeletionRequest(userP, pdrDTO);
        if (!isSent)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Check your password!");
        return ResponseEntity.status(HttpStatus.OK).body("Request for deleting account successfully sent!");
    }
}
