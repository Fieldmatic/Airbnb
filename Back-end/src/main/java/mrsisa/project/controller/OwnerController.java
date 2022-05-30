package mrsisa.project.controller;
import mrsisa.project.dto.PersonDTO;
import mrsisa.project.dto.UserDetailsDTO;
import mrsisa.project.model.Person;
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

@CrossOrigin("*")
@RestController
@RequestMapping("api/owner")
public class OwnerController {

    @Autowired
    UserService userService;


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


}
