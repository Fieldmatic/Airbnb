package mrsisa.project.service;

import mrsisa.project.dto.*;
import mrsisa.project.model.*;
import mrsisa.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    ReservationRepository reservationRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // test
    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private PaymentService paymentService;


    public Administrator update(AdminDTO dto) {
        Administrator admin = findAdminByUsername(dto.getUsername());
        if (admin != null) {
            if (!(dto.getPassword().equals("") && dto.getNewPassword().equals(""))) {
                if(!passwordEncoder.matches(dto.getPassword(), admin.getPassword()))
                    return null;
                admin.setPassword(passwordEncoder.encode(dto.getNewPassword()));
            }
            admin.setName(dto.getName());
            admin.setAddress(dto.getAddress());
            admin.setSurname(dto.getSurname());
            admin.setEmail(dto.getEmail());
            admin.setPhoneNumber(dto.getPhone());
            adminRepository.save(admin);
            return admin;
        }
        return null;
    }

    @Transactional
    public List<ProfileDeletionReasonDTO> getProfileDeletionReasons() {
        List<ProfileDeletionReasonDTO> pdrDTOs = new ArrayList<>();
        for(ProfileDeletionReason pdr : profileDeletionReasonRepository.findAll()) {
            if (!pdr.getViewed())
                pdrDTOs.add(new ProfileDeletionReasonDTO(pdr, new PersonBasicInfoDTO(pdr.getUser())));
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
                regReqDTOs.add(new RegistrationRequestDTO(regReq, new PersonBasicInfoDTO(regReq.getUser())));
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
        Payment payment = new Payment();
        payment.setMoneyPercentage(0.03);
        payment.setTotal(0);
        paymentService.save(payment);

        if (findAdminByUsername("admin") != null) return;
        //roleService.createRoles();
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

        // za potrebe testiranja
        Address address2 = new Address();
        address2.setZipCode("123123");
        address2.setStreet("Arse Teodorovica 2");
        address2.setState("Serbia");
        address2.setCity("Novi Sad");

        Instructor instructor = new Instructor();
        instructor.setActive(true);
        instructor.setApprovedAccount(true);
        instructor.setAddress(address2);
        instructor.setEmail("bane-gg@hotmail.com");
        instructor.setLastPasswordResetDate(null);
        instructor.setName("Banz");
        instructor.setPhoneNumber("065432234");
        instructor.setSurname("Ganz");
        instructor.setUsername("bane");
        instructor.setBiography("Ja sam jedan jako dobar instruktor pecanja i obozavam da pecam ribe.");
        instructor.setPassword(passwordEncoder.encode("bane"));
        instructor.setProfilePhoto(null);
        List<Role> roles2 = roleService.findByName("ROLE_INSTRUCTOR");
        instructor.setRoles(roles2);
        personRepository.save(instructor);

        Address address3 = new Address();
        address3.setZipCode("123123");
        address3.setStreet("Arse Teodorovica 2");
        address3.setState("Serbia");
        address3.setCity("Novi Sad");

        Client client = new Client();
        client.setActive(true);
        client.setAddress(address3);
        client.setPenalties(0);
        client.setName("Klinjo");
        client.setSurname("Klinjasti");
        client.setUsername("c");
        client.setPassword(passwordEncoder.encode("c"));
        List<Role> roles3 = roleService.findByName("ROLE_CLIENT");
        client.setRoles(roles3);
        personRepository.save(client);
    }

    public Administrator findAdminByUsername(String username) {
        return (Administrator) personRepository.findByUsername(username);
    }

    public void add(AdminDTO dto) {
        Administrator admin = new Administrator();
        admin.setActive(true);
        admin.setEmail(dto.getEmail());
        admin.setAddress(dto.getAddress());
        admin.setPassword(passwordEncoder.encode(dto.getPassword()));
        admin.setName(dto.getName());
        admin.setSurname(dto.getSurname());
        admin.setProfilePhoto(null);
        admin.setLastPasswordResetDate(null);
        admin.setPhoneNumber(dto.getPhone());
        admin.setUsername(dto.getUsername());
        List<Role> roles = roleService.findByName("ROLE_NEW_ADMIN");
        admin.setRoles(roles);
        adminRepository.save(admin);
    }

    public List<ChartDataDTO> getChartData(String startDate, String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        List<ChartDataDTO> chartData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        double percentage = paymentService.getMoneyPercentage();

        for (Reservation r : reservationRepository.findAll()) {
            if(start.isBefore(r.getEndDateTime()) && end.isAfter(r.getEndDateTime()) && !r.getActive()){
                String date = r.getEndDateTime().format(formatter);
                if (!this.dateInChartData(date, chartData)) {
                    chartData.add(new ChartDataDTO(date, r.getPrice() * percentage));
                } else {
                    for (ChartDataDTO dto : chartData) {
                        if (date.equals(dto.getDate()))
                            dto.setTotal(dto.getTotal() + r.getPrice() * percentage);
                    }
                }
            }
        }
        return chartData;
    }

    private boolean dateInChartData(String date, List<ChartDataDTO> chartData) {
        for (ChartDataDTO dto : chartData) {
            if (dto.getDate().equals(date))
                return true;
        }
        return false;
    }

    public Payment getPaymentConfig() {
        return paymentService.getPaymentConfig();
    }

    public void updatePaymentConfig(Payment newPayment) {
        paymentService.save(newPayment);
    }
}
