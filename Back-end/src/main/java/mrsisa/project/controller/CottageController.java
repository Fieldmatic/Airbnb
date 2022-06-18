package mrsisa.project.controller;

import mrsisa.project.dto.CottageDTO;
import mrsisa.project.dto.SearchDTO;
import mrsisa.project.model.Administrator;
import mrsisa.project.model.Boat;
import mrsisa.project.model.Cottage;
import mrsisa.project.model.CottageOwner;
import mrsisa.project.repository.PersonRepository;
import mrsisa.project.service.AdminService;
import mrsisa.project.service.CottageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.Principal;
import java.util.*;

@CrossOrigin("*")
@RestController
@RequestMapping("api/cottage")
public class CottageController {
    @Autowired
    private CottageService cottageService;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private AdminService adminService;


    @PostMapping(value = "/add")
    @PreAuthorize("hasRole('COTTAGE_OWNER')")
    public ResponseEntity<String> addCottage(@RequestPart("cottage") CottageDTO dto, @RequestPart(value = "files",required = false) MultipartFile[] multiPartFiles, Principal userP) throws IOException {
        cottageService.add(dto, Optional.ofNullable(multiPartFiles), userP);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }

    @GetMapping(value="/all")
    public ResponseEntity<List<CottageDTO>> getAllCottages() {
        List<CottageDTO> cottagesDTO = cottageService.findAll();
        return new ResponseEntity<>(cottagesDTO, HttpStatus.OK);
    }

    @GetMapping(value="/allAvailableByCity/{startDate}/{endDate}/{city}/{capacity}")
    public ResponseEntity<List<CottageDTO>> getAvailableCottagesByCity(@PathVariable String startDate, @PathVariable String endDate, @PathVariable String city) {
        List<CottageDTO> availableCottages = cottageService.getAvailableCottagesByCity(city, startDate, endDate);
        return new ResponseEntity<>(availableCottages, HttpStatus.OK);
    }

    @GetMapping(value="/allAvailable/{startDate}/{endDate}/{capacity}")
    public ResponseEntity<List<CottageDTO>> getAvailableCottages(@PathVariable String startDate, @PathVariable String endDate) {
        List<CottageDTO> availableCottages = cottageService.getAvailableCottages(startDate, endDate);
        return new ResponseEntity<>(availableCottages, HttpStatus.OK);
    }

    @GetMapping(value="/getOwnerCottages")
    @PreAuthorize("hasRole('COTTAGE_OWNER')")
    public ResponseEntity<List<CottageDTO>> getOwnerCottages(Principal userP) {
        List<CottageDTO> cottagesDTO = cottageService.findOwnerCottages(personRepository.findByUsername(userP.getName()).getId());
        return new ResponseEntity<>(cottagesDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/reviewsNumber/{id}")
    public ResponseEntity<Integer> getNumberOfCottageReviews(@PathVariable("id") Long id) {
        Integer reviews = cottageService.getNumberOfReviews(id);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PutMapping(value = "/edit/{id}")
    @PreAuthorize("hasRole('COTTAGE_OWNER')")
    public ResponseEntity<String> editCottage(@RequestPart("cottage") CottageDTO dto,@RequestPart(value = "files",required = false) MultipartFile[] multiPartFiles, @PathVariable("id") Long id) throws IOException {
        if (cottageService.edit(dto, id,Optional.ofNullable(multiPartFiles))) return ResponseEntity.status(HttpStatus.OK).body("Updated successfully");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("Cottage has pending reservations!");

    }

    @GetMapping(value = "/get/{id}")
    public ResponseEntity<CottageDTO> getCottage(@PathVariable("id") Long id) throws IOException {
        CottageDTO cottage = cottageService.getCottage(id);
        if (cottage == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(cottage, HttpStatus.OK);
    }


    @DeleteMapping(value = "/deleteCottage/{id}")
    @PreAuthorize("hasAnyRole('COTTAGE_OWNER', 'ADMIN')")
    public ResponseEntity<String> deleteCottage(@PathVariable Long id, Principal userP) {
        if (cottageService.deleteCottage(id, userP)) return ResponseEntity.ok().body("Success");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("Cottage has active reservations!");
    }

    /**
     * @apiNote This method is only for admin to limit new admin not to get cottages until he
     * changes password
     */
    @GetMapping(value="/getAll")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CottageDTO>> getAll(Principal userP) {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        List<CottageDTO> cottagesDTO = cottageService.findAll();
        return new ResponseEntity<>(cottagesDTO, HttpStatus.OK);
    }

}
