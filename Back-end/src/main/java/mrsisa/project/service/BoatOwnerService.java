package mrsisa.project.service;

import mrsisa.project.dto.PersonDTO;
import mrsisa.project.dto.ReservationStatisticsDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.AddressRepository;
import mrsisa.project.repository.BoatOwnerRepository;
import mrsisa.project.repository.BoatRepository;
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
public class BoatOwnerService {

    @Autowired
    BoatOwnerRepository boatOwnerRepository;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    RoleService roleService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AdminService adminService;

    @Autowired
    BoatRepository boatRepository;

    @Autowired
    BookableService bookableService;

    @Autowired
    PictureService pictureService;

    final String PICTURES_PATH = "src/main/resources/static/pictures/boatOwner/";

    public void add(PersonDTO dto, MultipartFile[] multipartFiles) throws IOException {
        BoatOwner owner = dtoToBoatOwner(dto);
        boatOwnerRepository.save(owner);
        List<String> paths = pictureService.addPictures(owner.getId(), PICTURES_PATH, multipartFiles);
        owner.setProfilePhoto(paths.get(0));
        boatOwnerRepository.save(owner);
        adminService.createRegistrationRequest(owner);
    }

    public String changeProfilePhoto(MultipartFile[] files, String username) throws IOException {
        BoatOwner boatOwner = boatOwnerRepository.findByUsername(username);
        List<String> paths = pictureService.addPictures(boatOwner.getId(),PICTURES_PATH, files);
        boatOwner.setProfilePhoto(paths.get(0));
        boatOwnerRepository.save(boatOwner);
        return boatOwner.getProfilePhoto();
    }

    public ReservationStatisticsDTO getReservationStatistics(Principal userP, Optional<Long> bookableId){
        BoatOwner owner = boatOwnerRepository.findByUsername(userP.getName());
        ReservationStatisticsDTO statistics = new ReservationStatisticsDTO();
        if (bookableId.isPresent()) bookableService.fillBookableReservationStatistics(bookableId.get(), statistics);
        else {
            for (Boat boat : owner.getBoats()) bookableService.fillBookableReservationStatistics(boat.getId(), statistics);
        }
        return statistics;
    }

    public Map<String, Double> getIncomeStatistics(LocalDateTime start, LocalDateTime end, Principal userP, Optional<Long> bookableId) {
        BoatOwner owner = boatOwnerRepository.findByUsername(userP.getName());
        Map<String, Double> incomeByBoat = new HashMap<>();
        if (bookableId.isPresent()){
            bookableService.fillBookableIncomeStatistics(start,end,incomeByBoat,bookableId.get());
        }
        else {
            for (Boat boat : owner.getBoats()) bookableService.fillBookableIncomeStatistics(start, end, incomeByBoat, boat.getId());
        }
        return incomeByBoat;
    }

    public BoatOwner findBoatOwnerByUsername(String username){return boatOwnerRepository.findByUsername(username);}

    private BoatOwner dtoToBoatOwner(PersonDTO dto) {
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
