package mrsisa.project.controller;

import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.Boat;
import mrsisa.project.model.Cottage;
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
import java.util.*;

@CrossOrigin("*")
@RestController
@RequestMapping("api/cottage")
public class CottageController {
    @Autowired
    private CottageService cottageService;


    @PostMapping(value = "/add")
    @PreAuthorize("hasRole('COTTAGE_OWNER')")
    public ResponseEntity<String> addCottage(@RequestPart("cottage") CottageDTO dto, @RequestPart("files") MultipartFile[] multiPartFiles) throws IOException {
        cottageService.add(dto, multiPartFiles);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }

    @PreAuthorize("hasRole('COTTAGE_OWNER')")
    @GetMapping(value="/all")
    public ResponseEntity<List<CottageDTO>> getAllCottages() {
        List<CottageDTO> cottagesDTO = cottageService.findAll();
        return new ResponseEntity<>(cottagesDTO, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('COTTAGE_OWNER')")
    @GetMapping(value="/getOwnerCottages/{id}")
    public ResponseEntity<List<CottageDTO>> getOwnerCottages(@PathVariable("id") Long id) {
        List<CottageDTO> cottagesDTO = cottageService.findOwnerCottages(id);
        return new ResponseEntity<>(cottagesDTO, HttpStatus.OK);
    }



    @GetMapping(value = "/reviewsNumber/{id}")
    public ResponseEntity<Integer> getNumberOfCottageReviews(@PathVariable("id") Long id) {
        Integer reviews = cottageService.getNumberOfReviews(id);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('COTTAGE_OWNER')")
    @PutMapping(value = "/edit/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> editCottage(@RequestBody CottageDTO dto, @PathVariable("id") Long id) {
        cottageService.edit(dto, id);
        return ResponseEntity.status(HttpStatus.OK).body("Updated successfully");
    }

    @GetMapping(value = "/edit/{id}")
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

}
