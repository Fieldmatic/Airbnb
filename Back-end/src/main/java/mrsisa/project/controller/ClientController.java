package mrsisa.project.controller;

import mrsisa.project.dto.ClientDTO;
import mrsisa.project.model.Client;
import mrsisa.project.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping
    public ClientDTO getClient() {
        return new ClientDTO(clientRepository.findAll().get(0));
    }
}
