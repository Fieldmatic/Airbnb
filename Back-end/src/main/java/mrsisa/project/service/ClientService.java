package mrsisa.project.service;

import mrsisa.project.dto.BoatOwnerDTO;
import mrsisa.project.dto.ClientDTO;
import mrsisa.project.model.Address;
import mrsisa.project.model.BoatOwner;
import mrsisa.project.model.Client;
import mrsisa.project.repository.AddressRepository;
import mrsisa.project.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AddressRepository addressRepository;

    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    public Client findOne(Long id) {
        return clientRepository.findById(id).orElseGet(null);
    }

    public Client save(Client client) {return clientRepository.save(client);}

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

    private Client dtoToClient(ClientDTO dto) {
        Client client = new Client();
        client.setName(dto.getName());
        client.setSurname(dto.getSurname());
        Address address = dto.getAddress();
        addressRepository.save(address);
        client.setAddress(address);
        client.setUsername(dto.getUsername());
        client.setPassword(dto.getPassword());
        client.setActive(true);
        client.setEmail(dto.getEmail());
        client.setPhoneNumber(dto.getPhoneNumber());
        client.setPoints(0);
        return client;
    }
}
