package mrsisa.project.service;

import mrsisa.project.dto.*;
import mrsisa.project.model.*;
import mrsisa.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
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

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private LoyaltyProgramService loyaltyProgramService;

    @Autowired
    private UserCategoryService userCategoryService;

    @Autowired
    private PictureService pictureService;

    @Autowired
    private ReservationService reservationService;

    final static String PICTURES_PATH = "src/main/resources/static/pictures/admin/";


    public Administrator update(AdminDTO dto) {
        Administrator admin = findAdminByUsername(dto.getUsername());
        if (admin != null) {
            if (!(dto.getPassword().equals("") && dto.getNewPassword().equals(""))) {
                if(!passwordEncoder.matches(dto.getPassword(), admin.getPassword()))
                    return null;
                admin.setPassword(passwordEncoder.encode(dto.getNewPassword()));
                admin.setLastPasswordResetDate(new Date());
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

    @Transactional
    public boolean deleteAccount(Long userId, Long profileDeletionId, boolean delete, String message) {
        Person user = personRepository.findById(userId).orElse(null);
        ProfileDeletionReason pdr = profileDeletionReasonRepository.findById(profileDeletionId).orElse(null);
        if (user == null || pdr == null) return false;
        if (delete) {
            user.setActive(false);
            personRepository.save(user);
        }
        pdr.setViewed(true);
        pdr.setApproved(delete);    // ovaj atribut je nepotreban
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

    @Transactional
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
     * @apiNote Use this method only one time to initialize default admin and system.
     */
    public void createFirstAdmin() {
        Payment payment = new Payment();
        payment.setMoneyPercentage(0.03);
        payment.setTotal(0);
        paymentService.save(payment);

        LoyaltyProgram loyaltyProgram = new LoyaltyProgram();
        loyaltyProgram.setBronzePoints(100);
        loyaltyProgram.setSilverPoints(250);
        loyaltyProgram.setGoldPoints(500);
        loyaltyProgram.setClientPoints(5);
        loyaltyProgram.setOwnerPoints(3);
        loyaltyProgramService.save(loyaltyProgram);
        this.createUserCategories(loyaltyProgram);

        if (findAdminByUsername("admin") != null) return;

        Address address = new Address();
        address.setZipCode("123123");
        address.setStreet("Arse Teodorovica 2");
        address.setState("Serbia");
        address.setCity("Novi Sad");

        Administrator admin = new Administrator();
        admin.setActive(true);
        admin.setAddress(address);
        admin.setEmail("bane-gg@hotmail.com");
        admin.setLastPasswordResetDate(new Date());
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

        CottageOwner instructor = new CottageOwner();
        instructor.setActive(true);
        instructor.setApprovedAccount(true);
        instructor.setAddress(address2);
        instructor.setEmail("bane-gg@hotmail.com");
        instructor.setLastPasswordResetDate(null);
        instructor.setName("Banz");
        instructor.setPhoneNumber("065432234");
        instructor.setSurname("Ganz");
        instructor.setUsername("bane");
        instructor.setProfilePhoto("src/main/resources/static/pictures/client/4/ocean-3605547_1920.jpg");
        instructor.setPoints(260);
        instructor.setCategory(userCategoryService.getSilverCategory());
//        instructor.setBiography("Ja sam jedan jako dobar instruktor pecanja i obozavam da pecam ribe.");
        instructor.setPassword(passwordEncoder.encode("bane"));
        List<Role> roles2 = roleService.findByName("ROLE_COTTAGE_OWNER");
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
        client.setPoints(0);
        client.setName("Klinjo");
        client.setSurname("Klinjasti");
        client.setUsername("c");
        client.setPhoneNumber("091999345");
        client.setEmail("bane-gg@hotmail.com");
        client.setProfilePhoto("src/main/resources/static/pictures/client/4/ocean-3605547_1920.jpg");
        client.setPassword(passwordEncoder.encode("c"));
        List<Role> roles3 = roleService.findByName("ROLE_CLIENT");
        client.setRoles(roles3);
        client.setCategory(userCategoryService.getRegularCategory());
        personRepository.save(client);
    }

    private void createUserCategories(LoyaltyProgram loyaltyProgram) {
        UserCategory category1 = new UserCategory();
        category1.setName(CategoryName.REGULAR);
        category1.setPoints(0);
        category1.setDiscount(0.0);
        this.userCategoryService.save(category1);

        UserCategory category2 = new UserCategory();
        category2.setName(CategoryName.BRONZE);
        category2.setPoints(loyaltyProgram.getBronzePoints());
        category2.setDiscount(0.05);
        this.userCategoryService.save(category2);

        UserCategory category3 = new UserCategory();
        category3.setName(CategoryName.SILVER);
        category3.setPoints(loyaltyProgram.getSilverPoints());
        category3.setDiscount(0.10);
        this.userCategoryService.save(category3);

        UserCategory category4 = new UserCategory();
        category4.setName(CategoryName.GOLD);
        category4.setPoints(loyaltyProgram.getGoldPoints());
        category4.setDiscount(0.15);
        this.userCategoryService.save(category4);
    }

    public Administrator findAdminByUsername(String username) {
        return (Administrator) personRepository.findByUsername(username);
    }

    public Administrator add(AdminDTO dto) {
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
        List<Role> roles = roleService.findByName("ROLE_ADMIN");
        admin.setRoles(roles);
        adminRepository.save(admin);
        return admin;
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

    public void updatePaymentConfig(PaymentDTO newPayment) {
        paymentService.save(dtoToPayment(newPayment));
    }

    private Payment dtoToPayment(PaymentDTO dto) {
        Payment payment = new Payment();
        payment.setTotal(dto.getTotal());
        payment.setMoneyPercentage(dto.getMoneyPercentage());
        return payment;
    }

    public LoyaltyProgram getLoyaltyProgram() {
        return loyaltyProgramService.getLoyaltyProgram();
    }

    public void updateLoyaltyProgram(LoyaltyProgramDTO newProgramDTO) {
        LoyaltyProgram loyaltyProgram = dtoToLoyaltyProgram(newProgramDTO);
        loyaltyProgramService.save(loyaltyProgram);
        for (Person person : personRepository.findAll()) {
            if (person instanceof Client)
                reservationService.tryChangeClientCategory((Client) person, loyaltyProgram);
            if (person instanceof Owner)
                reservationService.tryChangeOwnerCategory((Owner) person, loyaltyProgram);
        }
    }

    private LoyaltyProgram dtoToLoyaltyProgram(LoyaltyProgramDTO dto) {
        LoyaltyProgram loyaltyProgram = new LoyaltyProgram();
        loyaltyProgram.setBronzePoints(dto.getBronzePoints());
        loyaltyProgram.setSilverPoints(dto.getSilverPoints());
        loyaltyProgram.setGoldPoints(dto.getGoldPoints());
        loyaltyProgram.setClientPoints(dto.getClientPoints());
        loyaltyProgram.setOwnerPoints(dto.getOwnerPoints());
        return loyaltyProgram;
    }

    public String changeProfilePhoto(MultipartFile[] files, String username) throws IOException {
        Administrator admin = findAdminByUsername(username);
        List<String> paths = pictureService.addPictures(admin.getId(), PICTURES_PATH, files);
        admin.setProfilePhoto(paths.get(0));
        adminRepository.save(admin);
        return admin.getProfilePhoto();
    }

    public List<Administrator> findAll(){return adminRepository.findAll();}
}
