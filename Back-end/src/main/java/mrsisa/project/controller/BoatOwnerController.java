package mrsisa.project.controller;


import mrsisa.project.dto.BoatOwnerDTO;
import mrsisa.project.service.BoatOwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@CrossOrigin("*")
@RestController
@RequestMapping("api/boatOwner")
public class BoatOwnerController {

    @Autowired
    BoatOwnerService boatOwnerService;

    @PostMapping(value = "/add")
    public ResponseEntity<String> addOwner(@RequestPart("owner") BoatOwnerDTO dto, @RequestPart("files") MultipartFile[] multiPartFiles) throws IOException {
        boatOwnerService.add(dto, multiPartFiles);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }

}
