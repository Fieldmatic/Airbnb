package mrsisa.project.service;

import mrsisa.project.dto.BoatOwnerDTO;
import mrsisa.project.dto.ClientDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.AddressRepository;
import mrsisa.project.repository.BookableRepository;
import mrsisa.project.repository.ClientRepository;
import mrsisa.project.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    public Client findOne(Long id) {
        return clientRepository.findById(id).orElseGet(null);
    }

    public Client save(Client client) {return clientRepository.save(client);}

    public Client findClientByUsername(String username) {return (Client) personRepository.findByUsername(username);}

    public Client findClientById(Long id) {return clientRepository.getById(id);}

    final String PICTURES_PATH = "src/main/resources/static/pictures/client/";

    public void add(ClientDTO dto, MultipartFile[] multipartFiles) throws IOException {
        Client client = dtoToClient(dto);
        clientRepository.save(client);
        List<String> paths = addPictures(client, multipartFiles);
        client.setProfilePhoto(paths.get(0));
        clientRepository.save(client);
    }

    public List<String> addPictures(Client client, MultipartFile[] multipartFiles) throws IOException {
        List<String> paths = new ArrayList<>();
        if(multipartFiles == null) {
            return paths;
        }
        Path path = Paths.get(PICTURES_PATH + client.getId());
        savePicturesOnPath(client, multipartFiles, paths, path);
        return paths.stream().distinct().collect(Collectors.toList());
    }

    private void savePicturesOnPath(Client client, MultipartFile[] multipartFiles, List<String> paths, Path path) throws IOException {
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        for (MultipartFile mpf : multipartFiles) {
            String fileName = mpf.getOriginalFilename();
            try (InputStream inputStream = mpf.getInputStream()) {
                Path filePath = path.resolve(fileName);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                paths.add(PICTURES_PATH + client.getId() + "/" + fileName);
            } catch (IOException ioe) {
                throw new IOException("Could not save image file: " + fileName, ioe);
            }
        }
    }

    @Transactional
    public void addSubscription(Client client, Long bookableId) {
        Bookable bookable = bookableRepository.getById(bookableId);
        bookable.getSubscribedClients().add(client);
        bookableRepository.save(bookable);
        client.getSubscriptions().add(bookable);
        personRepository.save(client);
    }

    @Transactional
    public void deleteSubscription(Client client, Long bookableId) {
        Bookable bookable = bookableRepository.getById(bookableId);
        bookable.getSubscribedClients().remove(client);
        bookableRepository.save(bookable);

        client.getSubscriptions().remove(bookable);
        personRepository.save(client);
    }

    @Transactional
    public boolean checkIfClientIsSubscribed(Client client, Long bookableId) {
        Bookable bookable = bookableRepository.getById(bookableId);
        return client.getSubscriptions().contains(bookable);
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
        return client;
    }
}
