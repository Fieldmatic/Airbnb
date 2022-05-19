package mrsisa.project.service;

import mrsisa.project.dto.BoatOwnerDTO;
import mrsisa.project.dto.OwnerDTO;
import mrsisa.project.model.Address;
import mrsisa.project.model.BoatOwner;
import mrsisa.project.model.Role;
import mrsisa.project.repository.AddressRepository;
import mrsisa.project.repository.BoatOwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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
public class BoatOwnerService {

    @Autowired
    BoatOwnerRepository boatOwnerRepository;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    RoleService roleService;

    @Autowired
    PasswordEncoder passwordEncoder;

    final String PICTURES_PATH = "src/main/resources/static/pictures/boatOwner/";

    public void add(OwnerDTO dto, MultipartFile[] multipartFiles) throws IOException {
        BoatOwner owner = dtoToBoatOwner(dto);
        boatOwnerRepository.save(owner);
        List<String> paths = addPictures(owner, multipartFiles);
        owner.setProfilePhoto(paths.get(0));
        boatOwnerRepository.save(owner);
    }

    public List<String> addPictures(BoatOwner owner, MultipartFile[] multipartFiles) throws IOException {
        List<String> paths = new ArrayList<>();
        if(multipartFiles == null) {
            return paths;
        }
        Path path = Paths.get(PICTURES_PATH + owner.getId());
        savePicturesOnPath(owner, multipartFiles, paths, path);
        return paths.stream().distinct().collect(Collectors.toList());
    }

    private void savePicturesOnPath(BoatOwner owner, MultipartFile[] multipartFiles, List<String> paths, Path path) throws IOException {
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        for (MultipartFile mpf : multipartFiles) {
            String fileName = mpf.getOriginalFilename();
            try (InputStream inputStream = mpf.getInputStream()) {
                Path filePath = path.resolve(fileName);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                paths.add(PICTURES_PATH + owner.getId() + "/" + fileName);
            } catch (IOException ioe) {
                throw new IOException("Could not save image file: " + fileName, ioe);
            }
        }
    }

    private BoatOwner dtoToBoatOwner(OwnerDTO dto) {
        BoatOwner owner = new BoatOwner();
        owner.setName(dto.getName());
        owner.setSurname(dto.getSurname());
        owner.setAddress(dto.getAddress());
        owner.setUsername(dto.getUsername());
        owner.setPassword(passwordEncoder.encode(dto.getPassword()));
        owner.setActive(true);
        owner.setEmail(dto.getEmail());
        owner.setPhoneNumber(dto.getPhoneNumber());
        owner.setRegistrationExplanation(dto.getRegistrationExplanation());
        owner.setApprovedAccount(false);
        owner.setPoints(0);
        List<Role> roles = roleService.findByName(dto.getRole());
        owner.setRoles(roles);
        return owner;
    }
}
