package mrsisa.project.controller;

import mrsisa.project.dto.BoatDTO;
import mrsisa.project.dto.CottageDTO;
import mrsisa.project.dto.SearchDTO;
import mrsisa.project.model.Boat;
import mrsisa.project.model.Cottage;
import mrsisa.project.repository.PersonRepository;
import mrsisa.project.service.BoatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.jpa.repository.Query;
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
import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/boat")
public class BoatController {
    @Autowired
    private BoatService boatService;

    @Autowired
    private PersonRepository personRepository;

    @PostMapping(value = "/add")
    @PreAuthorize("hasRole('BOAT_OWNER')")
    public ResponseEntity<String> addBoat(@RequestPart("boat") BoatDTO dto, @RequestPart("files") MultipartFile[] multiPartFiles, Principal userP) throws IOException {
        boatService.add(dto, multiPartFiles, userP);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }

    @GetMapping(value="/getOwnerBoats")
    @PreAuthorize("hasRole('BOAT_OWNER')")
    public ResponseEntity<List<BoatDTO>> getOwnerBoats(Principal userP) {
        List<BoatDTO> boatsDTO = boatService.findOwnerBoats(personRepository.findByUsername(userP.getName()).getId());
        return new ResponseEntity<>(boatsDTO, HttpStatus.OK);
    }

    @PutMapping(value = "/edit/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BOAT_OWNER')")
    public ResponseEntity<String> editBoat(@RequestBody BoatDTO dto, @PathVariable("id") Long id) {
        boatService.edit(dto, id);
        return ResponseEntity.status(HttpStatus.OK).body("Updated successfully");
    }

    @GetMapping(value = "/get/{id}")
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

    @GetMapping(value="/allAvailableByCityAndCapacity/{startDate}/{endDate}/{city}/{capacity}")
    public ResponseEntity<List<BoatDTO>> getAvailableBoatsByCityAndCapacity(@PathVariable String startDate, @PathVariable String endDate, @PathVariable String city, @PathVariable Integer capacity) {
        List<BoatDTO> availableBoats = boatService.getAvailableBoatsByCityAndCapacity(city, capacity, startDate, endDate);
        return new ResponseEntity<>(availableBoats, HttpStatus.OK);
    }

    @GetMapping(value="/allAvailable/{startDate}/{endDate}/{capacity}")
    public ResponseEntity<List<BoatDTO>> getAvailableBoats(@PathVariable String startDate, @PathVariable String endDate, @PathVariable Integer capacity) {
        List<BoatDTO> availableBoats = boatService.getAvailableBoats(startDate, endDate, capacity);
        return new ResponseEntity<>(availableBoats, HttpStatus.OK);
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

    @DeleteMapping(value = "/deleteBoat/{id}")
    @PreAuthorize("hasAnyRole('BOAT_OWNER', 'ADMIN')")
    public ResponseEntity<String> deleteBoat(@PathVariable Long id, Principal userP) {
        if (boatService.deleteBoat(id, userP)) return ResponseEntity.ok().body("Success");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("Boat has active reservations!");
    }
}
