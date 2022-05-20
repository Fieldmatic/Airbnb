package mrsisa.project.controller;

import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.Boat;
import mrsisa.project.model.Cottage;
import mrsisa.project.model.CottageOwner;
import mrsisa.project.repository.PersonRepository;
import mrsisa.project.service.CottageService;
import mrsisa.project.service.UserService;
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


    @PostMapping(value = "/add")
    @PreAuthorize("hasRole('COTTAGE_OWNER')")
    public ResponseEntity<String> addCottage(@RequestPart("cottage") CottageDTO dto, @RequestPart("files") MultipartFile[] multiPartFiles, Principal userP) throws IOException {
        cottageService.add(dto, multiPartFiles, userP);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }

    @GetMapping(value="/all")
    public ResponseEntity<List<CottageDTO>> getAllCottages() {
        List<CottageDTO> cottagesDTO = cottageService.findAll();
        return new ResponseEntity<>(cottagesDTO, HttpStatus.OK);
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

    @PutMapping(value = "/edit/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('COTTAGE_OWNER')")
    public ResponseEntity<String> editCottage(@RequestBody CottageDTO dto, @PathVariable("id") Long id) {
        cottageService.edit(dto, id);
        return ResponseEntity.status(HttpStatus.OK).body("Updated successfully");
    }

    @GetMapping(value = "/get/{id}")
    public ResponseEntity<CottageDTO> getCottage(@PathVariable("id") Long id) throws IOException {
        Cottage cottage = cottageService.findOne(id);
        if (cottage == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        List<String> cottagePhotos = cottageService.getPhotos(cottage);
        cottage.setPictures(cottagePhotos);
        return new ResponseEntity<>(new CottageDTO(cottage), HttpStatus.OK);
    }

    @GetMapping(value="/getProfilePicture/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public ResponseEntity getCottageProfilePicture(@PathVariable Long id) throws IOException {
        Cottage cottage = cottageService.findOne(id);
        File file = new File(cottage.getProfilePicture());
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        return ResponseEntity.ok().body(resource);
    }


    @DeleteMapping(value = "/deleteCottage/{id}")
    @PreAuthorize("hasRole('COTTAGE_OWNER')")
    public ResponseEntity<String> deleteCottage(@PathVariable Long id, Principal userP) {
        if (cottageService.deleteCottage(id, userP)) return ResponseEntity.ok().body("Success");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("Cottage has active reservations!");
    }

}
