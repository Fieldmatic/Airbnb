package mrsisa.project.service;


import com.fasterxml.jackson.databind.JsonSerializer;
import mrsisa.project.dto.AdventureDTO;
import mrsisa.project.dto.InstructorDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.AddressRepository;
import mrsisa.project.repository.ClientRepository;
import mrsisa.project.repository.InstructorRepository;
import mrsisa.project.repository.OwnerRepository;
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
public class InstructorService {

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private AddressRepository addressRepository;

    final String PICTURES_PATH = "src/main/resources/static/pictures/instructor/";
    final String DEFAULT_PICTURE_PATH = "src/main/resources/static/pictures/defaults/default-profile-picture.jpg";

    public boolean add(InstructorDTO instructorDTO, MultipartFile[] multipartFiles) throws IOException {
        Instructor instructor = this.dtoToInstructor(instructorDTO);
        if (instructor == null) {
            return false;
        }
        instructorRepository.save(instructor);
        List<String> paths = addPictures(instructor, multipartFiles);
        if (paths.size() == 0)
            instructor.setProfilePhoto(DEFAULT_PICTURE_PATH);
        else
            instructor.setProfilePhoto(paths.get(0));
        instructorRepository.save(instructor);
        return true;
    }

    public void edit(InstructorDTO dto, Long id) {
        Instructor instructor = instructorRepository.findById(id).orElse(null);
        if (instructor != null) {
            instructor.setName(dto.getName());
            instructor.setAddress(dto.getAddress());
            instructor.setBiography(dto.getBiography());
            instructor.setSurname(dto.getSurname());
            instructor.setEmail(dto.getEmail());
            instructor.setPassword(dto.getPassword());
            instructor.setPhoneNumber(dto.getPhone());
            instructorRepository.save(instructor);
        }
    }

    public Instructor findOne(Long id) {
        return instructorRepository.findById(id).orElseGet(null);
    }

    private Instructor dtoToInstructor(InstructorDTO dto) {
        if (dto.getUsername() == null || !this.validateUsername(dto.getUsername())) {
            return null;
        }
        Instructor instructor = new Instructor();
        instructor.setName(dto.getName());
        Address address = dto.getAddress();
        addressRepository.save(address);
        instructor.setAddress(address);
        instructor.setActive(true);
        instructor.setApprovedAccount(false);    // TODO: send request to admin to activate profile
        instructor.setBiography(dto.getBiography());
        instructor.setSurname(dto.getSurname());
        instructor.setEmail(dto.getEmail());
        instructor.setPassword(dto.getPassword());
        instructor.setPhoneNumber(dto.getPhone());
        instructor.setPoints(0);
        instructor.setRegistrationExplanation(dto.getRegistrationExplanation());
        instructor.setUsername(dto.getUsername());
        return instructor;
    }

    private boolean validateUsername(String username) {
        List<Client> clients = clientRepository.findAll();
        List<Owner> owners = ownerRepository.findAll();
        List<Instructor> instructors = instructorRepository.findAll();
        for (Client client : clients){
            if (client.getUsername().equals(username))
                return false;
        }
        for (Owner owner : owners){
            if (owner.getUsername().equals(username))
                return false;
        }
        for (Instructor instructor : instructors){
            if (instructor.getUsername().equals(username))
                return false;
        }
        return true;
    }

    public List<String> addPictures(Instructor instructor, MultipartFile[] multipartFiles) throws IOException {
        List<String> paths = new ArrayList<>();
        if(multipartFiles == null) {
            return paths;
        }
        Path path = Paths.get(PICTURES_PATH + instructor.getId());
        savePicturesOnPath(instructor, multipartFiles, paths, path);
        return paths.stream().distinct().collect(Collectors.toList());
    }

    private void savePicturesOnPath(Instructor instructor, MultipartFile[] multipartFiles, List<String> paths, Path path) throws IOException {
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        for (MultipartFile mpf : multipartFiles) {
            String fileName = mpf.getOriginalFilename();
            try (InputStream inputStream = mpf.getInputStream()) {
                Path filePath = path.resolve(fileName);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                paths.add(PICTURES_PATH + instructor.getId() + "/" + fileName);
            } catch (IOException ioe) {
                throw new IOException("Could not save image file: " + fileName, ioe);
            }
        }
    }
}
