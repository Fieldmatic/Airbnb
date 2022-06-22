package mrsisa.project.controller;

import mrsisa.project.dto.*;
import mrsisa.project.model.Address;
import mrsisa.project.model.Client;
import mrsisa.project.service.AddressService;
import mrsisa.project.service.ClientService;
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
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;


@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;


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
        client = clientService.update(client, clientDetails);
        return new ResponseEntity<>(new ClientDTO(client), HttpStatus.OK);
    }

    @PutMapping(value = "/addSub/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<String> addSubscription(@PathVariable("id") Long id, Principal userP) {
        Client client = clientService.findClientByUsernameWithSubscriptions(userP.getName());
        clientService.addSubscription(client, id);
        return ResponseEntity.status(HttpStatus.OK).body("Success");
    }

    @DeleteMapping (value = "/deleteSub/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<String> deleteSubscription(@PathVariable("id") Long id, Principal userP) {
        Client client = clientService.findClientByUsernameWithSubscriptions(userP.getName());
        clientService.deleteSubscription(client, id);
        return ResponseEntity.status(HttpStatus.OK).body("Success");
    }

    @GetMapping(value = "/isClientSubscribed/{id}")
    @PreAuthorize("hasAnyRole('CLIENT')")
    public ResponseEntity<String> checkIfClientSubscribed(@PathVariable Long id, Principal userP) {
        Client client = clientService.findClientByUsername(userP.getName());
        if (clientService.checkIfClientIsSubscribed(client, id)) return ResponseEntity.ok().body("Client is subscribed");
        else return ResponseEntity.status(HttpStatus.CONFLICT).body("Client is not subscribed");
    }

    @GetMapping(value="/getProfilePicture", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<InputStreamResource> getProfilePicture(Principal userP) throws IOException {
        Client client = clientService.findClientByUsername(userP.getName());
        try {
            File file = new File(client.getProfilePhoto());
            return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(file.toPath())), HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(Paths.get("src/main/resources/static/pictures/defaults/default-profile-picture.jpg"))),HttpStatus.OK);
        }
    }

    @GetMapping(value="/getClientProfilePicture/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_INSTRUCTOR','ROLE_CLIENT')")
    @Transactional
    public ResponseEntity<InputStreamResource> getClientProfilePicture(@PathVariable("id") Long id) throws IOException {
        Client client = clientService.findClientById(id);
        try {
            File file = new File(client.getProfilePhoto());
            return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(file.toPath())), HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(new InputStreamResource(Files.newInputStream(Paths.get("src/main/resources/static/pictures/defaults/default-profile-picture.jpg"))),HttpStatus.OK);
        }
    }

    @GetMapping("/getClientBasicInfo/{id}")
    @PreAuthorize("hasAnyRole('ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_INSTRUCTOR','ROLE_CLIENT')")
    @Transactional
    public ResponseEntity<PersonBasicInfoDTO> getClientBasicInfo(@PathVariable("id") Long id) {
        return new ResponseEntity<>(new PersonBasicInfoDTO(clientService.findClientById(id)), HttpStatus.OK);
    }


    @GetMapping(value="/getClientCottageSubscriptions")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<CottageDTO>> getClientCottageSubscriptions(Principal userP) {
        List<CottageDTO> cottagesDTO = clientService.getClientCottageSubscriptions(clientService.findClientByUsername(userP.getName()));
        return new ResponseEntity<>(cottagesDTO, HttpStatus.OK);
    }

    @GetMapping(value="/getClientBoatSubscriptions")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<BoatDTO>> getClientBoatSubscriptions(Principal userP) {
        List<BoatDTO> boatsDTO = clientService.getClientBoatSubscriptions(clientService.findClientByUsername(userP.getName()));
        return new ResponseEntity<>(boatsDTO, HttpStatus.OK);
    }

    @GetMapping(value="/getClientAdventureSubscriptions")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<AdventureDTO>> getClientAdventureSubscriptions(Principal userP) {
        List<AdventureDTO> adventuresDTO = clientService.getClientAdventureSubscriptions(clientService.findClientByUsername(userP.getName()));
        return new ResponseEntity<>(adventuresDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/verify/{username}")
    public ResponseEntity<Boolean> verifyAccount(@PathVariable("username") String username){
        //long id=(customId-105)/41;
        Client user = clientService.findClientByUsername(username);
        if(user == null)
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);
        user.setVerified(true);
        Client userSaved = clientService.save(user);
        if(userSaved==null)
            return new ResponseEntity<>(false,HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(true,HttpStatus.OK);
    }
}
