package mrsisa.project.controller;


import mrsisa.project.dto.ActionDTO;
import mrsisa.project.service.ActionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin("*")
@RestController
@RequestMapping("api/action")
public class ActionController {
    @Autowired
    private ActionService actionService;

    @PostMapping(value = "/add")
    public ResponseEntity<String> addAction(@RequestBody ActionDTO actionDTO) throws IOException {
        actionService.add(actionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }
}
