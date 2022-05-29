package mrsisa.project.service;

import ch.qos.logback.core.encoder.EchoEncoder;
import mrsisa.project.dto.ProfileDeletionReasonDTO;
import mrsisa.project.dto.RegistrationRequestDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    PersonRepository personRepository;

    @Autowired
    OwnerRepository ownerRepository;

    @Autowired
    ProfileDeletionReasonRepository profileDeletionReasonRepository;

    @Autowired
    RegistrationRequestRepository registrationRequestRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public List<ProfileDeletionReasonDTO> getProfileDeletionReasons() {
        List<ProfileDeletionReasonDTO> pdrDTOs = new ArrayList<>();
        for(ProfileDeletionReason pdr : profileDeletionReasonRepository.findAll()) {
            if (!pdr.getViewed())
                pdrDTOs.add(new ProfileDeletionReasonDTO(pdr));
        }
        return pdrDTOs;
    }

    public boolean deleteAccount(Long userId, Long profileDeletionId, boolean delete, String message) {
        Owner user = ownerRepository.findById(userId).orElse(null);
        ProfileDeletionReason pdr = profileDeletionReasonRepository.findById(profileDeletionId).orElse(null);
        if (user == null || pdr == null) return false;
        if (delete)
            user.setActive(false);
        pdr.setViewed(true);
        pdr.setApproved(delete);
        ownerRepository.save(user);
        profileDeletionReasonRepository.save(pdr);
        try {
            String title = "AirBnb account deletion notification";
            emailService.sendAccountDeletionEmail(user, title, message, delete);
        }catch( Exception e ){
            return false;
        }
        return true;
    }

    public void createRegistrationRequest(Owner owner) {
        RegistrationRequest regReq = new RegistrationRequest(owner.getRegistrationExplanation(), owner);
        registrationRequestRepository.save(regReq);
    }

    public List<RegistrationRequestDTO> getRegistrationRequests() {
        List<RegistrationRequestDTO> regReqDTOs = new ArrayList<>();
        for(RegistrationRequest regReq : registrationRequestRepository.findAll()) {
            if (!regReq.getViewed())
                regReqDTOs.add(new RegistrationRequestDTO(regReq));
        }
        return regReqDTOs;
    }

    public boolean registerUser(Long userId, Long regId, boolean register, String message) {
        Owner user = ownerRepository.findById(userId).orElse(null);
        RegistrationRequest regReq = registrationRequestRepository.findById(regId).orElse(null);
        if (user == null || regReq == null) return false;
        if (register)
            user.setApprovedAccount(true);
        else {
            user.setApprovedAccount(false);
            user.setActive(false);
        }
        regReq.setViewed(true);
        regReq.setApproved(register);
        ownerRepository.save(user);
        registrationRequestRepository.save(regReq);
        try {
            String title = "AirBnb registration notification";
            emailService.sendRegistrationEmail(user, title, message, register);
        }catch( Exception e ){
            return false;
        }
        return true;
    }

    /**
     * @apiNote Use this method only one time to initialize default admin i system.
     * */
    public void createFirstAdmin() {
        roleService.createRoles();

        Address address = new Address();
        address.setZipCode("123123");
        address.setStreet("Arse Teodorovica 2");
        address.setState("Serbia");
        address.setCity("Novi Sad");

        Administrator admin = new Administrator();
        admin.setActive(true);
        admin.setAddress(address);
        admin.setEmail("bane-gg@hotmail.com");
        admin.setLastPasswordResetDate(null);
        admin.setName("Banz");
        admin.setPhoneNumber("065432234");
        admin.setSurname("Ganz");
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setProfilePhoto(null);
        List<Role> roles = roleService.findByName("ROLE_ADMIN");
        admin.setRoles(roles);
        adminRepository.save(admin);
    }



}
