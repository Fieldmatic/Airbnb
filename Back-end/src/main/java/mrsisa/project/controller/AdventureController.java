package mrsisa.project.controller;

import mrsisa.project.dto.AdventureDTO;
import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.Adventure;
import mrsisa.project.model.Cottage;
import mrsisa.project.service.AdventureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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

    @GetMapping(value="/all")
    public ResponseEntity<List<AdventureDTO>> getAllAdventures() {
        List<Adventure> adventures = adventureService.findAll();

        List<AdventureDTO> adventuresDTO = new ArrayList<>();
        for (Adventure adventure : adventures) {
            adventuresDTO.add(new AdventureDTO(adventure));
        }
        return new ResponseEntity<>(adventuresDTO, HttpStatus.OK);
    }
}
