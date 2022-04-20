package mrsisa.project.controller;

import mrsisa.project.dto.AdventureDTO;
import mrsisa.project.model.Adventure;
import mrsisa.project.service.AdventureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/adventure")
@CrossOrigin("*")
public class AdventureController {

    @Autowired
    private AdventureService adventureService;

    @PostMapping(path = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> addAdventure(@RequestBody AdventureDTO adventureDTO){
        adventureService.add(adventureDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }

    @PutMapping(value = "/edit/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> editAdventure(@RequestBody AdventureDTO dto, @PathVariable("id") Long id) {
        adventureService.edit(dto, id);
        return ResponseEntity.status(HttpStatus.OK).body("Updated successfully");
    }

    @GetMapping(value = "/edit/{id}")
    public ResponseEntity<AdventureDTO> getAdventure(@PathVariable("id") Long id){
        Adventure adventure = adventureService.findOne(id);
        if (adventure == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(new AdventureDTO(adventure), HttpStatus.OK);
    }
}
