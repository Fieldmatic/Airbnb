package mrsisa.project.controller;

import mrsisa.project.dto.BoatDTO;
import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.Boat;
import mrsisa.project.model.Cottage;
import mrsisa.project.service.BoatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/boat")
public class BoatController {
    @Autowired
    private BoatService boatService;

    @PostMapping(value = "/add")
    public ResponseEntity<String> addBoat(@RequestPart("boat") BoatDTO dto, @RequestPart("files") MultipartFile[] multiPartFiles) throws IOException {
        boatService.add(dto, multiPartFiles);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }

    @PutMapping(value = "/edit/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> editBoat(@RequestBody BoatDTO dto, @PathVariable("id") Long id) {
        boatService.edit(dto, id);
        return ResponseEntity.status(HttpStatus.OK).body("Updated successfully");
    }

    @GetMapping(value = "/edit/{id}")
    public ResponseEntity<BoatDTO> getBoat(@PathVariable("id") Long id) throws IOException {
        Boat boat = boatService.findOne(id);
        if (boat == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        List<String> boatPhotos = boatService.getPhotos(boat);
        boat.setPictures(boatPhotos);
        return new ResponseEntity<>(new BoatDTO(boat), HttpStatus.OK);
    }

    @GetMapping(value="/all")
    public ResponseEntity<List<BoatDTO>> getAllBoats() {
        List<Boat> boats = boatService.findAll();

        List<BoatDTO> boatsDTO = new ArrayList<>();
        for (Boat boat : boats) {
            boatsDTO.add(new BoatDTO(boat));
        }
        return new ResponseEntity<>(boatsDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/reviewsNumber/{id}")
    public ResponseEntity<Integer> getNumberOfBoatReviews(@PathVariable("id") Long id) {
        Boat boat = boatService.findOne(id);
        Integer reviews = boat.getReviews().size();
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @GetMapping(value="/getProfilePicture/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public ResponseEntity getBoatProfilePicture(@PathVariable Long id) throws IOException {
        Boat boat = boatService.findOne(id);
        File file = new File(boat.getProfilePicture());
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        return ResponseEntity.ok().body(resource);
    }
}
