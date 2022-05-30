package mrsisa.project.controller;

import mrsisa.project.dto.ClientBasicInfoDTO;
import mrsisa.project.dto.ClientDTO;
import mrsisa.project.model.*;
import mrsisa.project.service.AddressService;
import mrsisa.project.service.ClientService;
import mrsisa.project.service.ProfileDeletionReasonService;
import mrsisa.project.service.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.Principal;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private AddressService addressService;


    @Autowired
    ValidationService validationService;

    @GetMapping("/get")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientDTO> getClient(Principal userP) {
        return new ResponseEntity<>(new ClientDTO(clientService.findClientByUsername(userP.getName())), HttpStatus.OK);
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

    @GetMapping(value="/getProfilePicture", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<InputStreamResource> getProfilePicture(Principal userP) throws IOException {
        Client client = clientService.findClientByUsername(userP.getName());
        File file = new File(client.getProfilePhoto());
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        return new ResponseEntity<>(resource, HttpStatus.OK);
    }

    @GetMapping(value="/getClientProfilePicture/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_INSTRUCTOR','ROLE_CLIENT')")
    @Transactional
    public ResponseEntity<InputStreamResource> getClientProfilePicture(@PathVariable("id") Long id) throws IOException {
        Client client = clientService.findClientById(id);
        File file = new File(client.getProfilePhoto());
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        return new ResponseEntity<>(resource, HttpStatus.OK);
    }

    @GetMapping("/getClientBasicInfo/{id}")
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_INSTRUCTOR','ROLE_CLIENT')")
    @Transactional
    public ResponseEntity<ClientBasicInfoDTO> getClientBasicInfo(@PathVariable("id") Long id) {
        return new ResponseEntity<>(new ClientBasicInfoDTO(clientService.findClientById(id)), HttpStatus.OK);
    }
}
