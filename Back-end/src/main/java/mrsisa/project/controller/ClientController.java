package mrsisa.project.controller;

import mrsisa.project.dto.BoatOwnerDTO;
import mrsisa.project.dto.ClientDTO;
import mrsisa.project.dto.ProfileDeletionReasonDTO;
import mrsisa.project.model.Address;
import mrsisa.project.model.Client;
import mrsisa.project.model.Person;
import mrsisa.project.model.ProfileDeletionReason;
import mrsisa.project.service.AddressService;
import mrsisa.project.service.ClientService;
import mrsisa.project.service.ProfileDeletionReasonService;
import mrsisa.project.service.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private AddressService addressService;

    @Autowired
    private ProfileDeletionReasonService deletionReasonService;

    @Autowired
    ValidationService validationService;

    @GetMapping
    public ClientDTO getClient() {
        return new ClientDTO(clientService.findAll().get(0));
    }

    @PutMapping("/update")
    public ResponseEntity<ClientDTO> updateClient(@RequestBody ClientDTO clientDetails) {
        Client client = clientService.findOne(clientDetails.getId());

        if (client == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Address address = addressService.findOne(clientDetails.getAddress().getId());

        //update adrese odradi

        client.setUsername(clientDetails.getUsername());
        client.setPassword(clientDetails.getPassword());
        client.setName(clientDetails.getName());
        client.setSurname(clientDetails.getSurname());
        client.setAddress(clientDetails.getAddress());
        client.setEmail(clientDetails.getEmail());
        client.setPhoneNumber(clientDetails.getPhoneNumber());
        address.setStreet(clientDetails.getAddress().getStreet());
        address.setCity(clientDetails.getAddress().getCity());
        address.setState(clientDetails.getAddress().getState());
        addressService.save(address);

        client = clientService.save(client);
        return new ResponseEntity<>(new ClientDTO(client), HttpStatus.OK);
    }

    @PostMapping(value = "/saveDeletionReason", consumes = MediaType.ALL_VALUE)
    public ResponseEntity<String> saveReason(@RequestBody String reason) {
        Client client = clientService.findAll().get(0);
        ProfileDeletionReason deletionReason = new ProfileDeletionReason(reason.substring(0, reason.length() - 1).replace('+', ' '), false, client);
        deletionReasonService.save(deletionReason);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }


    @PostMapping(value = "/add")
    public ResponseEntity<String> addClient(@RequestPart("client") ClientDTO dto, @RequestPart("files") MultipartFile[] multiPartFiles) throws IOException {
        if (!validationService.usernameAvailable(dto.getUsername())) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is taken!");
        clientService.add(dto, multiPartFiles);
        return ResponseEntity.status(HttpStatus.CREATED).body("Success");
    }
}
