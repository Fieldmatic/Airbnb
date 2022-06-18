package mrsisa.project.service;


import mrsisa.project.dto.InstructorDTO;
import mrsisa.project.dto.ProfileDeletionReasonDTO;
import mrsisa.project.dto.ReservationStatisticsDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.*;
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
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InstructorService {

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AdminService adminService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private BookableService bookableService;
    @Autowired
    private ProfileDeletionReasonRepository profileDeletionReasonRepository;

    @Autowired
    private PictureService pictureService;

    final String PICTURES_PATH = "src/main/resources/static/pictures/instructor/";
    final String DEFAULT_PICTURE_PATH = "src/main/resources/static/pictures/defaults/default-profile-picture.jpg";

    public Person add(InstructorDTO instructorDTO, MultipartFile[] multipartFiles) throws IOException {
        Instructor instructor = this.dtoToInstructor(instructorDTO);
        if (instructor == null) {
            return null;
        }
        instructorRepository.save(instructor);
        List<String> paths = pictureService.addPictures(instructor.getId(),PICTURES_PATH, multipartFiles);
        if (paths.size() == 0)
            instructor.setProfilePhoto(DEFAULT_PICTURE_PATH);
        else
            instructor.setProfilePhoto(paths.get(0));
        instructorRepository.save(instructor);
        adminService.createRegistrationRequest(instructor);
        return instructor;
    }

    public String changeProfilePhoto(MultipartFile[] files, String username) throws IOException {
        Instructor instructor = instructorRepository.findByUsername(username);
        List<String> paths = pictureService.addPictures(instructor.getId(),PICTURES_PATH, files);
        instructor.setProfilePhoto(paths.get(0));
        instructorRepository.save(instructor);
        return instructor.getProfilePhoto();
    }

    public Instructor update(InstructorDTO dto) {
        Instructor instructor = instructorRepository.findById(dto.getId()).orElse(null);
        if (instructor != null) {
            instructor.setName(dto.getName());
            instructor.getAddress().setCity(dto.getAddress().getCity());
            instructor.getAddress().setState(dto.getAddress().getState());
            instructor.getAddress().setStreet(dto.getAddress().getStreet());
            instructor.getAddress().setZipCode(dto.getAddress().getZipCode());
            addressRepository.save(instructor.getAddress());
            instructor.setBiography(dto.getBiography());
            instructor.setSurname(dto.getSurname());
            instructor.setEmail(dto.getEmail());
            instructor.setPassword(dto.getPassword());
            instructor.setPhoneNumber(dto.getPhone());
            instructorRepository.save(instructor);
            return instructor;
        }
        return null;
    }

    public Instructor findOne(Long id) {
        return instructorRepository.findById(id).orElse(null);
    }

    private Instructor dtoToInstructor(InstructorDTO dto) {
        if (dto.getUsername() == null || !userService.usernameAvailable(dto.getUsername())) {
            return null;
        }
        Instructor instructor = new Instructor();
        instructor.setName(dto.getName());
        instructor.setAddress(dto.getAddress());
        instructor.setActive(true);
        instructor.setApprovedAccount(false);
        instructor.setBiography(dto.getBiography());
        instructor.setSurname(dto.getSurname());
        instructor.setEmail(dto.getEmail());
        instructor.setPassword(passwordEncoder.encode(dto.getPassword()));
        instructor.setPhoneNumber(dto.getPhone());
        instructor.setPoints(0);
        instructor.setRegistrationExplanation(dto.getRegistrationExplanation());
        instructor.setUsername(dto.getUsername());
        List<Role> roles = roleService.findByName("ROLE_INSTRUCTOR");
        instructor.setRoles(roles);
        return instructor;
    }

    public ReservationStatisticsDTO getReservationStatistics(Principal userP, Optional<Long> bookableId){
        Instructor instructor = instructorRepository.findByUsername(userP.getName());
        ReservationStatisticsDTO statistics = new ReservationStatisticsDTO();
        if (bookableId.isPresent()) bookableService.fillBookableReservationStatistics(bookableId.get(), statistics);
        else {
            for (Adventure adventure : instructor.getAdventures()) bookableService.fillBookableReservationStatistics(adventure.getId(), statistics);
        }
        return statistics;
    }

    public Map<String, Double> getIncomeStatistics(LocalDateTime start, LocalDateTime end, Principal userP, Optional<Long> bookableId) {
        Instructor instructor = instructorRepository.findByUsername(userP.getName());
        Map<String, Double> incomeByAdventure = new HashMap<>();
        if (bookableId.isPresent()){
            bookableService.fillBookableIncomeStatistics(start,end,incomeByAdventure,bookableId.get());
        }
        else {
            for (Adventure adventure : instructor.getAdventures()) bookableService.fillBookableIncomeStatistics(start, end, incomeByAdventure, adventure.getId());
        }
        return incomeByAdventure;
    }

    public Instructor findInstructorByUsername(String username) {
        return (Instructor) personRepository.findByUsername(username);
    }

    public Instructor save(Instructor instructor) {
        return instructorRepository.save(instructor);
    }

    public boolean sendProfileDeletionRequest(Principal userP, ProfileDeletionReasonDTO pdrDTO) {
        Person person = personRepository.findByUsername(userP.getName());
        System.out.println("=================\n" + pdrDTO.getPassword() + "\n=================");
        System.out.println("=================\n" + person.getPassword() + "\n=================");
        System.out.println("=================\n" + passwordEncoder.encode(pdrDTO.getPassword()) + "\n=================");
        if(!passwordEncoder.matches(pdrDTO.getPassword(), person.getPassword())) return false;
        ProfileDeletionReason profileDeletionReason = this.dtoToPDR(pdrDTO, person);
        profileDeletionReasonRepository.save(profileDeletionReason);
        return true;
    }

    private ProfileDeletionReason dtoToPDR(ProfileDeletionReasonDTO pdrDTO, Person person) {
        ProfileDeletionReason profileDeletionReason = new ProfileDeletionReason();
        profileDeletionReason.setReason(pdrDTO.getReason());
        profileDeletionReason.setUser(person);
        profileDeletionReason.setViewed(false);
        return profileDeletionReason;
    }
}
