package mrsisa.project.controller;

import mrsisa.project.dto.BoatDTO;
import mrsisa.project.model.Boat;
import mrsisa.project.repository.PersonRepository;
import mrsisa.project.service.BoatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/boat")
public class BoatController {
    @Autowired
    private BoatService boatService;

    @Autowired
    private PersonRepository personRepository;

    @PostMapping(value = "/add")
    @PreAuthorize("hasRole('BOAT_OWNER')")
    public ResponseEntity<String> addBoat(@RequestPart("boat") BoatDTO dto, @RequestPart(value = "files",required = false) MultipartFile[] multiPartFiles, Principal userP) throws IOException {
        boatService.add(dto, Optional.ofNullable(multiPartFiles), userP);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }

    @GetMapping(value="/getOwnerBoats")
    @PreAuthorize("hasRole('BOAT_OWNER')")
    public ResponseEntity<List<BoatDTO>> getOwnerBoats(Principal userP) {
        List<BoatDTO> boatsDTO = boatService.findOwnerBoats(personRepository.findByUsername(userP.getName()).getId());
        return new ResponseEntity<>(boatsDTO, HttpStatus.OK);
    }

    @PutMapping(value = "/edit/{id}")
    @PreAuthorize("hasRole('BOAT_OWNER')")
    public ResponseEntity<String> editBoat(@RequestPart("boat") BoatDTO dto, @RequestPart(value = "files",required = false) MultipartFile[] multiPartFiles, @PathVariable("id") Long id) throws IOException {
        if (boatService.edit(dto, id, Optional.ofNullable(multiPartFiles))) return ResponseEntity.status(HttpStatus.OK).body("Updated successfully");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("Boat has pending reservations!");
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
        return new ResponseEntity<>(boatService.getNumberOfReviews(id), HttpStatus.OK);
    }

    @DeleteMapping(value = "/deleteBoat/{id}")
    @PreAuthorize("hasAnyRole('BOAT_OWNER', 'ADMIN')")
    public ResponseEntity<String> deleteBoat(@PathVariable Long id, Principal userP) {
        if (boatService.deleteBoat(id, userP)) return ResponseEntity.ok().body("Success");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("Boat has active reservations!");
    }
}
