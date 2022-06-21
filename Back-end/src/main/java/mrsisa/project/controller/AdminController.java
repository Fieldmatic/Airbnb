package mrsisa.project.controller;

import mrsisa.project.dto.AdminDTO;
import mrsisa.project.dto.ChartDataDTO;
import mrsisa.project.dto.ProfileDeletionReasonDTO;
import mrsisa.project.dto.RegistrationRequestDTO;
import mrsisa.project.model.Administrator;
import mrsisa.project.model.LoyaltyProgram;
import mrsisa.project.model.Payment;
import mrsisa.project.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/admin")
public class AdminController {

    @Autowired
    AdminService adminService;


    @GetMapping(value = "/get")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDTO> getAdmin(Principal userP) {
        return new ResponseEntity<>(new AdminDTO(adminService.findAdminByUsername(userP.getName())), HttpStatus.OK);
    }

    @PutMapping(value = "/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDTO> updateAdmin(@RequestBody AdminDTO dto) {
        Administrator admin = adminService.update(dto);
        if (admin == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new AdminDTO(admin), HttpStatus.OK);
    }

    @GetMapping(path = "/getProfileDeletionRequests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProfileDeletionReasonDTO>> getProfileDeletionRequests(Principal userP) {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        List<ProfileDeletionReasonDTO> list = adminService.getProfileDeletionReasons();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PutMapping(path = "/confirmProfileDeletion/{userId}&{pdrId}&{confirmation}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> confirmDeletion(@PathVariable("userId") Long userId,
                                                  @PathVariable("pdrId") Long pdrId,
                                                  @PathVariable("confirmation") String confirmation,
                                                  @RequestPart("message") String message,
                                                  Principal userP) {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
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
    public ResponseEntity<List<RegistrationRequestDTO>> getUserRegistrationRequests(Principal userP) {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        List<RegistrationRequestDTO> list = adminService.getRegistrationRequests();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PutMapping(path = "/registerUser/{userId}&{regId}&{confirmation}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> registerUser(@PathVariable("userId") Long userId,
                                               @PathVariable("regId") Long regId,
                                               @PathVariable("confirmation") String confirmation,
                                               @RequestPart("message") String message,
                                               Principal userP) {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        boolean register = Boolean.parseBoolean(confirmation);
        boolean success = adminService.registerUser(userId, regId, register, message);
        if (!success)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error! User not found.");
        if (register)
            return ResponseEntity.status(HttpStatus.OK).body("User successfully registered!");
        return ResponseEntity.status(HttpStatus.OK).body("Request for user registration denied!");
    }

    @GetMapping(path = "/getChartData/{startDate}&{endDate}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ChartDataDTO>> getChartData(@PathVariable String startDate,
                                                           @PathVariable String endDate,
                                                           Principal userP) {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        List<ChartDataDTO> chartData = adminService.getChartData(startDate, endDate);
        if (chartData.size() == 0)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(chartData);
        return new ResponseEntity<>(chartData, HttpStatus.OK);
    }

    @GetMapping(path = "/getPaymentConfig")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Payment> getPaymentConfig(Principal userP) {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        Payment payment = adminService.getPaymentConfig();
        return new ResponseEntity<>(payment, HttpStatus.OK);
    }

    @PutMapping(path = "/updatePaymentConfig")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updatePaymentConfig(@RequestBody Payment payment, Principal userP) {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        adminService.updatePaymentConfig(payment);
        return ResponseEntity.status(HttpStatus.OK).body("Payment config successfully updated!");
    }

    @GetMapping(path = "/getLoyaltyProgram")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoyaltyProgram> getLoyaltyProgram(Principal userP) {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        LoyaltyProgram loyaltyProgram = adminService.getLoyaltyProgram();
        return new ResponseEntity<>(loyaltyProgram, HttpStatus.OK);
    }

    @PutMapping(path = "/updateLoyaltyProgram")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateLoyaltyProgram(@RequestBody LoyaltyProgram loyaltyProgram, Principal userP) {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        adminService.updateLoyaltyProgram(loyaltyProgram);
        return ResponseEntity.status(HttpStatus.OK).body("Loyalty program successfully updated!");
    }


    @GetMapping(value = "/getProfilePicture", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<InputStreamResource> getProfilePicture(Principal userP) throws IOException {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        try {
            File file = new File(admin.getProfilePhoto());
            return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(file.toPath())), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(Paths.get("src/main/resources/static/pictures/defaults/default-profile-picture.jpg"))), HttpStatus.OK);
        }
    }


}
