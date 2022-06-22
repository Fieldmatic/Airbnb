package mrsisa.project.controller;

import mrsisa.project.dto.AdventureDTO;
import mrsisa.project.dto.BoatDTO;
import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.Administrator;
import mrsisa.project.model.Adventure;
import mrsisa.project.repository.PersonRepository;
import mrsisa.project.service.AdminService;
import mrsisa.project.service.AdventureService;
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
@RequestMapping("api/adventure")
public class AdventureController {

    @Autowired
    private AdventureService adventureService;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private AdminService adminService;

    @PostMapping(path = "/add")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<String> addAdventure(@RequestPart("adventure") AdventureDTO adventureDTO,
                                               @RequestPart(value = "files", required = false) MultipartFile[] multiPartFiles,
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

    @GetMapping(value="/allAvailableByCityAndCapacity/{startDate}/{endDate}/{city}/{capacity}")
    public ResponseEntity<List<AdventureDTO>> getAvailableAdventuresByCityAndCapacity(@PathVariable String startDate, @PathVariable String endDate, @PathVariable String city, @PathVariable Integer capacity) {
        List<AdventureDTO> availableAdventures = adventureService.getAvailableAdventuresByCityAndCapacity(city, capacity, startDate, endDate);
        return new ResponseEntity<>(availableAdventures, HttpStatus.OK);
    }

    @GetMapping(value="/allAvailable/{startDate}/{endDate}/{capacity}")
    public ResponseEntity<List<AdventureDTO>> getAvailableAdventures(@PathVariable String startDate, @PathVariable String endDate, @PathVariable Integer capacity) {
        List<AdventureDTO> availableAdventures = adventureService.getAvailableAdventures(startDate, endDate, capacity);
        return new ResponseEntity<>(availableAdventures, HttpStatus.OK);
    }
    
    @PutMapping(value = "/edit/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<String> editAdventure(@RequestPart("adventure") AdventureDTO dto,
                                                @RequestPart(value = "files",required = false) MultipartFile[] multiPartFiles,
                                                @PathVariable("id") Long id) throws IOException
    {
        if (adventureService.edit(dto, id, Optional.ofNullable(multiPartFiles)))
            return ResponseEntity.status(HttpStatus.OK).body("Updated successfully");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("Adventure has pending reservations!");
    }

    @GetMapping(value = "/get/{id}")
    public ResponseEntity<AdventureDTO> getAdventure(@PathVariable("id") Long id) throws IOException {
        AdventureDTO adventureDTO = adventureService.getAdventure(id);
        if (adventureDTO == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(adventureDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/reviewsNumber/{id}")
    public ResponseEntity<Integer> getNumberOfAdventureReviews(@PathVariable("id") Long id) {
        return new ResponseEntity<>(adventureService.getNumberOfReviews(id), HttpStatus.OK);
    }

    @DeleteMapping(value = "/deleteAdventure/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<String> deleteAdventure(@PathVariable Long id, Principal userP) {
        if (adventureService.deleteAdventure(id, userP)) return ResponseEntity.ok().body("Success");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("Adventure has active reservations!");
    }

    @GetMapping(value="/getInstructorAdventures")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<List<AdventureDTO>> getInstructorAdventures(Principal userP) {
        List<AdventureDTO> DTOs = adventureService.getInstructorAdventures(personRepository.findByUsername(userP.getName()).getId());
        return new ResponseEntity<>(DTOs, HttpStatus.OK);
    }

    /**
     * @apiNote This method is only for admin to limit new admin not to get adventures until he
     * changes password
     */
    @GetMapping(value="/getAll")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdventureDTO>> getAll(Principal userP) {
        Administrator admin = adminService.findAdminByUsername(userP.getName());
        if (admin.getLastPasswordResetDate() == null)
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        List<Adventure> adventures = adventureService.findAll();
        List<AdventureDTO> adventuresDTO = new ArrayList<>();
        for (Adventure adventure : adventures) {
            adventuresDTO.add(new AdventureDTO(adventure));
        }
        return new ResponseEntity<>(adventuresDTO, HttpStatus.OK);
    }
}
