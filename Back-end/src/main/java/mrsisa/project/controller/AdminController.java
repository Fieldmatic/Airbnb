package mrsisa.project.controller;

import mrsisa.project.dto.ProfileDeletionReasonDTO;
import mrsisa.project.dto.RegistrationRequestDTO;
import mrsisa.project.model.Adventure;
import mrsisa.project.model.Person;
import mrsisa.project.model.RegistrationRequest;
import mrsisa.project.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    AdminService adminService;

    @PostMapping(path = "/sendDeletionRequest/{id}")
    public ResponseEntity<String> sendRequestForProfileDeletion(@RequestPart("data") ProfileDeletionReasonDTO pdrDTO, @PathVariable("id") Long id)
    {
        boolean isSent = adminService.sendRequestForProfileDeletion(id, pdrDTO);
        if (!isSent)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Check your password!");
        return ResponseEntity.status(HttpStatus.OK).body("Request for deleting account successfully sent!");
    }

    @GetMapping(path = "/getProfileDeletionRequests")
    public ResponseEntity<List<ProfileDeletionReasonDTO>> getProfileDeletionRequests()
    {
        List<ProfileDeletionReasonDTO> list = adminService.getProfileDeletionReasons();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PutMapping(path = "/confirmProfileDeletion/{userId}/{pdrId}/{confirmation}")
    public ResponseEntity<String> confirmDeletion(@PathVariable("userId") Long userId,
                                                  @PathVariable("pdrId") Long pdrId,
                                                  @PathVariable("confirmation") String confirmation)
    {
        boolean delete = Boolean.parseBoolean(confirmation);
        boolean success = adminService.deleteAccount(userId, pdrId, delete);
        if (!success)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error! User not found.");
        if (delete)
            return ResponseEntity.status(HttpStatus.OK).body("Account deleted!");
        return ResponseEntity.status(HttpStatus.OK).body("Request for deleting account denied!");
    }

    @GetMapping(path = "/getUserRegistrationRequests")
    public ResponseEntity<List<RegistrationRequestDTO>> getUserRegistrationRequests()
    {
        List<RegistrationRequestDTO> list = adminService.getRegistrationRequests();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PutMapping(path = "/registerUser/{userId}/{regId}/{confirmation}")
    public ResponseEntity<String> registerUser(@PathVariable("userId") Long userId,
                                               @PathVariable("regId") Long regId,
                                               @PathVariable("confirmation") String confirmation,
                                               @RequestPart("message") String message)
    {
        boolean register = Boolean.parseBoolean(confirmation);
        boolean success = adminService.registerUser(userId, regId, register, message);
        if (!success)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error! User not found.");
        if (register)
            return ResponseEntity.status(HttpStatus.OK).body("User successfully registered!");
        return ResponseEntity.status(HttpStatus.OK).body("Request for user registration denied!");
    }

//    @GetMapping(path = "/getUserProfilePicture/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
//    public ResponseEntity getAdventureProfilePicture(@PathVariable Long id) throws IOException {
//        Person person = adminService.findPersonById(id);
//        File file = new File(adventure.getProfilePicture());
//        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
//        return ResponseEntity.ok().body(resource);
//    }


}
