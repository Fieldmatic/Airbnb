package mrsisa.project.controller;

import mrsisa.project.dto.AdventureDTO;
import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.Adventure;
import mrsisa.project.model.Boat;
import mrsisa.project.model.Cottage;
import mrsisa.project.service.AdventureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/adventure")
@CrossOrigin("*")
public class AdventureController {

    @Autowired
    private AdventureService adventureService;

    @PostMapping(path = "/add")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<String> addAdventure(@RequestPart("adventure") AdventureDTO adventureDTO,
                                               @RequestPart("files") MultipartFile[] multiPartFiles,
                                               Principal userP) throws IOException
    {
        adventureService.add(adventureDTO, multiPartFiles, userP);
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
    
    @PutMapping(value = "/edit/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<String> editAdventure(@RequestPart("adventure") AdventureDTO dto, @PathVariable("id") Long id)
    {
        adventureService.edit(dto, id);
        return ResponseEntity.status(HttpStatus.OK).body("Updated successfully");
    }

    @GetMapping(value = "/get/{id}")
    public ResponseEntity<AdventureDTO> getAdventure(@PathVariable("id") Long id) throws IOException {
        Adventure adventure = adventureService.findOne(id);
        if (adventure == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        List<String> adventurePhotos = adventureService.getPhotos(adventure);
        AdventureDTO dto = new AdventureDTO(adventure);
        dto.setPhotos(adventurePhotos);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping(value = "/reviewsNumber/{id}")
    public ResponseEntity<Integer> getNumberOfAdventureReviews(@PathVariable("id") Long id) {
        Adventure adventure = adventureService.findOne(id);
        Integer reviews = adventure.getReviews().size();
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @GetMapping(value="/getProfilePicture/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public ResponseEntity getAdventureProfilePicture(@PathVariable Long id) throws IOException {
        Adventure adventure = adventureService.findOne(id);
        File file = new File(adventure.getProfilePicture());
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        return ResponseEntity.ok().body(resource);
    }

    @DeleteMapping(value = "/deleteAdventure/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<String> deleteAdventure(@PathVariable Long id, Principal userP) {
        if (adventureService.deleteAdventure(id, userP)) return ResponseEntity.ok().body("Success");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("Adventure has active reservations!");
    }
}
