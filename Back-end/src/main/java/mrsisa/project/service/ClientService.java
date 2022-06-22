package mrsisa.project.service;

import mrsisa.project.dto.AdventureDTO;
import mrsisa.project.dto.BoatDTO;
import mrsisa.project.dto.ClientDTO;
import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.AddressRepository;
import mrsisa.project.repository.BookableRepository;
import mrsisa.project.repository.ClientRepository;
import mrsisa.project.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private BookableRepository bookableRepository;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserCategoryService userCategoryService;

    @Autowired
    private PictureService pictureService;

    final static String picturesPath = "src/main/resources/static/pictures/client/";


    public List<Client> findAll() {
        return clientRepository.findAll();
    }
    @Cacheable(value = "personId", key = "#id",unless="#result == null")
    public Client findOne(Long id) {return clientRepository.getById(id);}

    public Client save(Client client) {return clientRepository.save(client);}

    public Client findClientByUsername(String username) {return clientRepository.findByUsername(username);}
    public Client findClientByEmail(String email) {return clientRepository.findByEmail(email);}
    @Cacheable(value = "personId", key = "#id",unless="#result == null")
    public Client findClientById(Long id) {return clientRepository.getById(id);}

    public Client findClientByUsernameWithSubscriptions(String username) {
        return clientRepository.findClientByUsernameWithSubscriptions(username);
    }


    public Client add(ClientDTO dto, Optional<MultipartFile[]> multipartFiles) throws IOException {
        Client client = dtoToClient(dto);
        clientRepository.save(client);
        if (multipartFiles.isPresent()) {
            List<String> paths = pictureService.addPictures(client.getId(), picturesPath, multipartFiles.get());
            client.setProfilePhoto(paths.get(0));
        }
        clientRepository.save(client);
        return client;
    }


    @Transactional
    public Client update(Client client, ClientDTO clientDetails) {
        Address address = addressRepository.getById(clientDetails.getAddress().getId());

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
        addressRepository.save(address);

        client = clientRepository.save(client);
        return client;
    }

    public String changeProfilePhoto(MultipartFile[] files, String username) throws IOException {
        Client client = clientRepository.findByUsername(username);
        pictureService.tryDeletePhoto(client.getProfilePhoto());
        List<String> paths = pictureService.addPictures(client.getId(), picturesPath, files);
        client.setProfilePhoto(paths.get(0));
        clientRepository.save(client);
        return client.getProfilePhoto();
    }

    public void addSubscription(Client client, Long bookableId) {
        Bookable bookable = bookableRepository.getByIdWithSubscribedClients(bookableId);
        bookable.getSubscribedClients().add(client);
        client.getSubscriptions().add(bookable);
        personRepository.save(client);
    }

    public void deleteSubscription(Client client, Long bookableId) {
        for (Bookable bookable: client.getSubscriptions()) {
            if (bookable.getId().equals(bookableId)) {
                client.getSubscriptions().remove(bookable);
                break;
            }
        }
        personRepository.save(client);
    }

    @Transactional
    public boolean checkIfClientIsSubscribed(Client client, Long bookableId) {
        for (Bookable bookable: client.getSubscriptions()) {
            if (bookable.getId().equals(bookableId)) {
                return true;
            }
        }
        return false;
    }

    public List<CottageDTO> getClientCottageSubscriptions(Client client) {
       List<CottageDTO> cottages = new ArrayList<>();
       for (Bookable bookable: client.getSubscriptions()) {
           if (bookable instanceof Cottage)
               cottages.add(new CottageDTO((Cottage) bookable));
       }
       return cottages;
    }

    public List<BoatDTO> getClientBoatSubscriptions(Client client) {
        List<BoatDTO> boats = new ArrayList<>();
        for (Bookable bookable: client.getSubscriptions()) {
            if (bookable instanceof Boat)
                boats.add(new BoatDTO((Boat) bookable));
        }
        return boats;
    }

    public List<AdventureDTO> getClientAdventureSubscriptions(Client client) {
        List<AdventureDTO> adventures = new ArrayList<>();
        for (Bookable bookable: client.getSubscriptions()) {
            if (bookable instanceof Adventure)
                adventures.add(new AdventureDTO((Adventure) bookable));
        }
        return adventures;
    }

    private Client dtoToClient(ClientDTO dto) {
        Client client = new Client();
        client.setName(dto.getName());
        client.setSurname(dto.getSurname());
        Address address = dto.getAddress();
        client.setAddress(address);
        client.setUsername(dto.getUsername());
        client.setPassword(passwordEncoder.encode(dto.getPassword()));
        client.setActive(true);
        client.setEmail(dto.getEmail());
        client.setPhoneNumber(dto.getPhoneNumber());
        client.setPoints(0);
        client.setPenalties(0);
        List<Role> roles = roleService.findByName("ROLE_CLIENT");
        client.setRoles(roles);
        client.setCategory(userCategoryService.getRegularCategory());
        return client;
    }
}
