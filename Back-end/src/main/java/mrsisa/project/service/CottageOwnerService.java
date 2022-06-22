package mrsisa.project.service;

import mrsisa.project.dto.PersonDTO;
import mrsisa.project.dto.ReservationStatisticsDTO;
import mrsisa.project.model.Cottage;
import mrsisa.project.model.CottageOwner;
import mrsisa.project.model.Person;
import mrsisa.project.model.Role;
import mrsisa.project.repository.AddressRepository;
import mrsisa.project.repository.CottageOwnerRepository;
import mrsisa.project.repository.CottageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CottageOwnerService {

    @Autowired
    CottageOwnerRepository cottageOwnerRepository;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    RoleService roleService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    CottageRepository cottageRepository;

    @Autowired
    AdminService adminService;

    @Autowired
    BookableService bookableService;

    @Autowired
    PictureService pictureService;

    @Autowired
    UserCategoryService userCategoryService;

    final static String picturesPath = "src/main/resources/static/pictures/cottageOwner/";

    public Person add(PersonDTO dto, Optional<MultipartFile[]> multipartFiles) throws IOException {
        CottageOwner owner = dtoToCottageOwner(dto);
        cottageOwnerRepository.save(owner);
        if (multipartFiles.isPresent()) {
            List<String> paths = pictureService.addPictures(owner.getId(), picturesPath, multipartFiles.get());
            owner.setProfilePhoto(paths.get(0));
        }
        cottageOwnerRepository.save(owner);
        adminService.createRegistrationRequest(owner);
        return owner;
    }

    public String changeProfilePhoto(MultipartFile[] files, String username) throws IOException {
        CottageOwner cottageOwner = cottageOwnerRepository.findByUsername(username);
        pictureService.tryDeletePhoto(cottageOwner.getProfilePhoto());
        List<String> paths = pictureService.addPictures(cottageOwner.getId(), picturesPath, files);
        cottageOwner.setProfilePhoto(paths.get(0));
        cottageOwnerRepository.save(cottageOwner);
        return cottageOwner.getProfilePhoto();
    }

    private CottageOwner dtoToCottageOwner(PersonDTO dto) {
        CottageOwner owner = new CottageOwner();
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
        owner.setCategory(userCategoryService.getRegularCategory());
        owner.setPoints(0);
        List<Role> roles = roleService.findByName(dto.getRole());
        owner.setRoles(roles);
        return owner;
    }

    public CottageOwner findCottageOwnerByUsername(String username){return cottageOwnerRepository.findByUsername(username);}

    public ReservationStatisticsDTO getReservationStatistics(Principal userP, Optional<Long> bookableId){
        CottageOwner owner = cottageOwnerRepository.findByUsername(userP.getName());
        ReservationStatisticsDTO statistics = new ReservationStatisticsDTO();
        if (bookableId.isPresent()) bookableService.fillBookableReservationStatistics(bookableId.get(), statistics);
        else {
            for (Cottage cottage : owner.getCottages()) bookableService.fillBookableReservationStatistics(cottage.getId(), statistics);
        }
        return statistics;
    }

    public Map<String, Double> getIncomeStatistics(LocalDateTime start, LocalDateTime end, Principal userP,  Optional<Long> bookableId) {
        CottageOwner owner = cottageOwnerRepository.findByUsername(userP.getName());
        Map<String, Double> incomeByCottage = new HashMap<>();
        if (bookableId.isPresent()){
            bookableService.fillBookableIncomeStatistics(start,end,incomeByCottage,bookableId.get());
        }
        else {
            for (Cottage cottage : owner.getCottages()) bookableService.fillBookableIncomeStatistics(start, end, incomeByCottage, cottage.getId());
        }
        return incomeByCottage;
    }

    public List<CottageOwner> findAll(){return cottageOwnerRepository.findAll();}
}
