package mrsisa.project.controller;
import mrsisa.project.dto.CottageOwnerDTO;
import mrsisa.project.service.CottageOwnerService;
import mrsisa.project.service.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@CrossOrigin("*")
@RestController
@RequestMapping("api/cottageOwner")
public class CottageOwnerController {

    @Autowired
    CottageOwnerService cottageOwnerService;

    @Autowired
    ValidationService validationService;

    @PostMapping(value = "/add")
    public ResponseEntity<String> addOwner(@RequestPart("owner") CottageOwnerDTO dto, @RequestPart("files") MultipartFile[] multiPartFiles) throws IOException {
        if (!validationService.usernameAvailable(dto.getUsername())) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is taken!");
        cottageOwnerService.add(dto, multiPartFiles);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }

}
