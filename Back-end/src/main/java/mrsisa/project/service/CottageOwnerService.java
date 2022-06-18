package mrsisa.project.service;

import mrsisa.project.dto.PersonDTO;
import mrsisa.project.dto.ReservationStatisticsDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

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

    final String PICTURES_PATH = "src/main/resources/static/pictures/cottageOwner/";

    public Person add(PersonDTO dto, Optional<MultipartFile[]> multipartFiles) throws IOException {
        CottageOwner owner = dtoToCottageOwner(dto);
        if (multipartFiles.isPresent()) {
            List<String> paths = addPictures(owner, multipartFiles.get());
            owner.setProfilePhoto(paths.get(0));
        }
        cottageOwnerRepository.save(owner);
        adminService.createRegistrationRequest(owner);
        return owner;
    }

    public List<String> addPictures(CottageOwner owner, MultipartFile[] multipartFiles) throws IOException {
        List<String> paths = new ArrayList<>();
        if(multipartFiles == null) return paths;
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
        owner.setPoints(0);
        List<Role> roles = roleService.findByName(dto.getRole());
        owner.setRoles(roles);
        return owner;
    }

    public CottageOwner findCottageOwnerByUsername(String username){return cottageOwnerRepository.findByUsername(username);}

    public ReservationStatisticsDTO getReservationStatistics(Principal userP){
        CottageOwner owner = cottageOwnerRepository.findByUsername(userP.getName());
        ReservationStatisticsDTO statistics = new ReservationStatisticsDTO();
        for (Cottage cottage : owner.getCottages()){
            List<Reservation> reservations = cottageRepository.findByIdWithReservations(cottage.getId()).getReservations();
            for (Reservation reservation : reservations) {
                String year = String.valueOf(reservation.getEndDateTime().getYear());
                String month = String.valueOf(reservation.getEndDateTime().getMonth());
                String week = String.valueOf(calcNextMonday(reservation.getEndDateTime()));
                if (!statistics.getYearlyStatistics().containsKey(year)) statistics.getYearlyStatistics().put(year, 1);
                else statistics.getYearlyStatistics().put(year, statistics.getYearlyStatistics().get(year) + 1);
                if (!statistics.getMonthlyStatistics().containsKey(month)) statistics.getMonthlyStatistics().put(month, 1);
                else statistics.getMonthlyStatistics().put(month, statistics.getMonthlyStatistics().get(month) + 1);
                if (!statistics.getWeeklyStatistics().containsKey(week)) statistics.getWeeklyStatistics().put(week, 1);
                else statistics.getWeeklyStatistics().put(week, statistics.getWeeklyStatistics().get(week)+1);
            }
        }
        return statistics;
    }

    public Map<String, Double> getIncomeStatistics(LocalDateTime start, LocalDateTime end, Principal userP) {
        CottageOwner owner = cottageOwnerRepository.findByUsername(userP.getName());
        Map<String, Double> incomeByCottage = new HashMap<>();
        for (Cottage cottage : owner.getCottages()){
            List<Reservation> reservations = cottageRepository.findByIdWithReservations(cottage.getId()).getReservations();
            for (Reservation reservation : reservations) {
                if (reservation.getEndDateTime().isAfter(start) && reservation.getEndDateTime().isBefore(end)){
                    if (!incomeByCottage.containsKey(cottage.getName())) incomeByCottage.put(cottage.getName(), reservation.getPrice());
                    else incomeByCottage.put(cottage.getName(), incomeByCottage.get(cottage.getName()) + reservation.getPrice());
                }
            }
        }
        return incomeByCottage;
    }

    private LocalDateTime calcNextMonday(LocalDateTime dateTime) {
        return dateTime.with(TemporalAdjusters.previous(DayOfWeek.MONDAY));
    }

    public List<CottageOwner> findAll(){return cottageOwnerRepository.findAll();}
}
