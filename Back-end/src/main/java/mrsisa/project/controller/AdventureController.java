package mrsisa.project.controller;

import mrsisa.project.dto.AdventureDTO;
import mrsisa.project.model.Adventure;
import mrsisa.project.service.AdventureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("api/adventure")
@CrossOrigin("*")
public class AdventureController {

    @Autowired
    private AdventureService adventureService;

    @PostMapping(path = "/add")
    public ResponseEntity<String> addAdventure(@RequestPart("adventure") AdventureDTO adventureDTO,
                                               @RequestPart("files") MultipartFile[] multiPartFiles) throws IOException
    {
        adventureService.add(adventureDTO, multiPartFiles);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }

    @PutMapping(value = "/edit/{id}")
    public ResponseEntity<String> editAdventure(@RequestPart("adventure") AdventureDTO dto, @PathVariable("id") Long id)
    {
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
