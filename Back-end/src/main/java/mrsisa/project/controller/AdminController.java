package mrsisa.project.controller;

import mrsisa.project.dto.AdminDTO;
import mrsisa.project.dto.InstructorDTO;
import mrsisa.project.dto.ProfileDeletionReasonDTO;
import mrsisa.project.dto.RegistrationRequestDTO;
import mrsisa.project.model.Administrator;
import mrsisa.project.model.Instructor;
import mrsisa.project.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/admin")
public class AdminController {

    @Autowired
    AdminService adminService;


    @GetMapping(value = "/get")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDTO> getInstructor(Principal userP){
        return new ResponseEntity<>(new AdminDTO(adminService.findAdminByUsername(userP.getName())), HttpStatus.OK);
    }

    @PutMapping(value = "/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDTO> updateAdmin(@RequestBody AdminDTO dto)
    {
        Administrator admin = adminService.update(dto);
        if (admin == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new AdminDTO(admin), HttpStatus.OK);
    }

    @GetMapping(path = "/getProfileDeletionRequests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProfileDeletionReasonDTO>> getProfileDeletionRequests()
    {
        List<ProfileDeletionReasonDTO> list = adminService.getProfileDeletionReasons();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PutMapping(path = "/confirmProfileDeletion/{userId}&{pdrId}&{confirmation}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> confirmDeletion(@PathVariable("userId") Long userId,
                                                  @PathVariable("pdrId") Long pdrId,
                                                  @PathVariable("confirmation") String confirmation,
                                                  @RequestPart("message") String message)
    {
        boolean delete = Boolean.parseBoolean(confirmation);
        boolean success = adminService.deleteAccount(userId, pdrId, delete, message);
        if (!success)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error! User not found.");
        if (delete)
            return ResponseEntity.status(HttpStatus.OK).body("Account deleted!");
        return ResponseEntity.status(HttpStatus.OK).body("Request for deleting account denied!");
    }

    @GetMapping(path = "/getUserRegistrationRequests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RegistrationRequestDTO>> getUserRegistrationRequests()
    {
        List<RegistrationRequestDTO> list = adminService.getRegistrationRequests();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PutMapping(path = "/registerUser/{userId}&{regId}&{confirmation}")
    @PreAuthorize("hasRole('ADMIN')")
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
