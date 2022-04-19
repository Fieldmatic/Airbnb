package mrsisa.project.controller;

import mrsisa.project.dto.ClientDTO;
import mrsisa.project.model.Address;
import mrsisa.project.model.Client;
import mrsisa.project.model.Person;
import mrsisa.project.service.AddressService;
import mrsisa.project.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private AddressService addressService;

    @GetMapping
    public ClientDTO getClient() {
        return new ClientDTO(clientService.findAll().get(0));
    }

    @PutMapping("/update")
    public ResponseEntity<ClientDTO> updateClient(@RequestBody ClientDTO clientDetails) {
        System.out.println(clientDetails);
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
}
