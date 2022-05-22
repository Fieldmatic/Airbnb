package mrsisa.project.controller;
import mrsisa.project.dto.OwnerDTO;
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
public class OwnerController {

    @Autowired
    CottageOwnerService cottageOwnerService;

    @Autowired
    ValidationService validationService;


}
