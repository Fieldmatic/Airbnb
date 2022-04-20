package mrsisa.project.controller;

import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.Cottage;
import mrsisa.project.service.CottageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@CrossOrigin("*")
@RestController
@RequestMapping("api/cottage")
public class CottageController {
    @Autowired
    private CottageService cottageService;

    @PostMapping(value = "/add")
    public ResponseEntity<String> addCottage(@RequestBody CottageDTO dto) throws IOException {
        cottageService.add(dto, new MultipartFile[10]);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }

    @PutMapping(value = "/edit/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> editCottage(@RequestBody CottageDTO dto, @PathVariable("id") Long id) {
        cottageService.edit(dto, id);
        return ResponseEntity.status(HttpStatus.OK).body("Updated successfully");
    }

    @GetMapping(value = "/edit/{id}")
    public ResponseEntity<CottageDTO> getCottage(@PathVariable("id") Long id){
        System.out.println(id);
        Cottage cottage = cottageService.findOne(id);
        if (cottage == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(new CottageDTO(cottage), HttpStatus.OK);
    }
}
