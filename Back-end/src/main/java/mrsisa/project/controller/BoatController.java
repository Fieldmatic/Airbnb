package mrsisa.project.controller;

import mrsisa.project.dto.BoatDTO;
import mrsisa.project.model.Boat;
import mrsisa.project.service.BoatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
    public ResponseEntity<BoatDTO> getBoat(@PathVariable("id") Long id){
        Boat boat = boatService.findOne(id);
        if (boat == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(new BoatDTO(boat), HttpStatus.OK);
    }
}
