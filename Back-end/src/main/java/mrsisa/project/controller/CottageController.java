package mrsisa.project.controller;

import mrsisa.project.dto.CottageDTO;
import mrsisa.project.service.CottageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("api/cottage")
public class CottageController {
    @Autowired
    private CottageService cottageService;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> addCottage(@RequestBody CottageDTO dto) {
        cottageService.add(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }
}
