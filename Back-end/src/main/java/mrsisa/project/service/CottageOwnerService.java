package mrsisa.project.service;

import mrsisa.project.dto.BoatOwnerDTO;
import mrsisa.project.dto.CottageOwnerDTO;
import mrsisa.project.model.Address;
import mrsisa.project.model.BoatOwner;
import mrsisa.project.model.CottageOwner;
import mrsisa.project.model.Person;
import mrsisa.project.repository.*;
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
public class CottageOwnerService {

    @Autowired
    CottageOwnerRepository cottageOwnerRepository;

    @Autowired
    PersonRepository personRepository;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    AdminService adminService;

    final String PICTURES_PATH = "src/main/resources/static/pictures/cottageOwner/";


    public void add(CottageOwnerDTO dto, MultipartFile[] multipartFiles) throws IOException {
        CottageOwner owner = dtoToCottageOwner(dto);
        cottageOwnerRepository.save(owner);
        List<String> paths = addPictures(owner, multipartFiles);
        owner.setProfilePhoto(paths.get(0));
        cottageOwnerRepository.save(owner);
        adminService.createRegistrationRequest(owner);
    }

    public List<String> addPictures(CottageOwner owner, MultipartFile[] multipartFiles) throws IOException {
        List<String> paths = new ArrayList<>();
        if(multipartFiles == null) {
            return paths;
        }
        Path path = Paths.get(PICTURES_PATH + owner.getId());
        savePicturesOnPath(owner, multipartFiles, paths, path);
        return paths.stream().distinct().collect(Collectors.toList());
    }

    private void savePicturesOnPath(CottageOwner owner, MultipartFile[] multipartFiles, List<String> paths, Path path) throws IOException {
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

    private CottageOwner dtoToCottageOwner(CottageOwnerDTO dto) {
        CottageOwner owner = new CottageOwner();
        owner.setName(dto.getName());
        owner.setSurname(dto.getSurname());
        Address address = dto.getAddress();
        addressRepository.save(address);
        owner.setAddress(address);
        owner.setUsername(dto.getUsername());
        owner.setPassword(dto.getPassword());
        owner.setActive(true);
        owner.setEmail(dto.getEmail());
        owner.setPhoneNumber(dto.getPhoneNumber());
        owner.setRegistrationExplanation(dto.getRegistrationExplanation());
        owner.setApprovedAccount(false);
        owner.setPoints(0);
        return owner;
    }
}
