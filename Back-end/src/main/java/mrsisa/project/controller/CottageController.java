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
import java.util.ArrayList;
import java.util.List;

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


    @GetMapping(value="/all")
    public ResponseEntity<List<CottageDTO>> getAllCottages() {
        List<Cottage> cottages =cottageService.findAll();

        List<CottageDTO> cottagesDTO = new ArrayList<>();
        for (Cottage cottage : cottages) {
            cottagesDTO.add(new CottageDTO(cottage));
        }
        return new ResponseEntity<>(cottagesDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/reviewsNumber/{id}")
    public ResponseEntity<Integer> getNumberOfCottageReviews(@PathVariable("id") Long id) {
        Cottage cottage = cottageService.findOne(id);
        Integer reviews = cottage.getReviews().size();
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }
}
