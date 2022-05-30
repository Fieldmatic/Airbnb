package mrsisa.project.controller;

import mrsisa.project.dto.PasswordChangeDTO;
import mrsisa.project.dto.PersonDTO;
import mrsisa.project.service.ProfileDeletionReasonService;
import mrsisa.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProfileDeletionReasonService deletionReasonService;

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
}
