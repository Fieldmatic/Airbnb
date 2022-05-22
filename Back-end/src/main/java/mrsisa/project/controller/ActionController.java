package mrsisa.project.controller;


import mrsisa.project.dto.ActionDTO;
import mrsisa.project.service.ActionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/action")
public class ActionController {
    @Autowired
    private ActionService actionService;

    @PostMapping(value = "/add")
    public ResponseEntity<String> addAction(@RequestBody ActionDTO actionDTO) throws IOException {
        try {
            actionService.add(actionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Success");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad request");
        }
    }

    @GetMapping(value="/getActions/{id}")
    public ResponseEntity<List<ActionDTO>> getActions(@PathVariable("id") Long id) {
        List<ActionDTO> actions = actionService.findActions(id);
        return new ResponseEntity<>(actions, HttpStatus.OK);
    }
}
