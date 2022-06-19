package mrsisa.project.controller;

import mrsisa.project.dto.PasswordChangeDTO;
import mrsisa.project.dto.PersonDTO;
import mrsisa.project.model.Role;
import mrsisa.project.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProfileDeletionReasonService deletionReasonService;

    @Autowired
    private CottageOwnerService cottageOwnerService;

    @Autowired
    private InstructorService instructorService;

    @Autowired
    private BoatOwnerService boatOwnerService;

    @Autowired
    private ClientService clientService;


    @PostMapping(value = "/saveDeletionReason", consumes = MediaType.ALL_VALUE)
    @PreAuthorize("hasAnyRole('ROLE_INSTRUCTOR','ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_CLIENT')")
    public ResponseEntity<String> saveReason(@RequestBody String reason, Principal userP) {
        if (deletionReasonService.createDeleteRequest(reason,userP)) return ResponseEntity.status(HttpStatus.CREATED).body("Success");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("You already sent an request!");
    }

    @PutMapping(value= "/changePassword")
    @PreAuthorize("hasAnyRole('ROLE_INSTRUCTOR','ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_CLIENT')")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeDTO passwordChangeDTO, Principal userP){
        String response = userService.updatePassword(userP, passwordChangeDTO);
        if (response.equals("Success")) return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
        else return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_CLIENT')")
    public ResponseEntity<String> updateUser(@RequestBody PersonDTO userDetails, Principal userP) {
        if (userService.updateUser(userDetails, userP)) return new ResponseEntity<>("Success", HttpStatus.OK);
        else return new ResponseEntity<>("Error", HttpStatus.CONFLICT);
    }

    @PutMapping("/changeProfilePicture")
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_CLIENT', 'ROLE_INSTRUCTOR')")
    public ResponseEntity<InputStreamResource> changeProfilePicture(@RequestPart("files") MultipartFile[] multiPartFiles, Principal userP) throws IOException {
        Role role = userService.getByUsername(userP.getName()).getRoles().get(0);
        String profilePicturePath = "";
        switch (role.getName()){
            case "ROLE_COTTAGE_OWNER" :
                profilePicturePath = cottageOwnerService.changeProfilePhoto(multiPartFiles,userP.getName());
                break;
            case "ROLE_BOAT_OWNER" :
                profilePicturePath = boatOwnerService.changeProfilePhoto(multiPartFiles,userP.getName());
                break;
            case "ROLE_CLIENT" :
                profilePicturePath = clientService.changeProfilePhoto(multiPartFiles,userP.getName());
                break;
            case "ROLE_INSTRUCTOR":
                profilePicturePath = instructorService.changeProfilePhoto(multiPartFiles,userP.getName());
                break;
        }
        File file = new File(profilePicturePath);
        return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(file.toPath())), HttpStatus.OK);
    }
}
