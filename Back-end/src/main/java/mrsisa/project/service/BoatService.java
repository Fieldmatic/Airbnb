package mrsisa.project.service;


import mrsisa.project.dto.BoatDTO;
import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoatService {
    @Autowired
    BoatRepository boatRepository;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    PriceListRepository priceListRepository;

    @Autowired
    PersonRepository personRepository;

    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    TagService tagService;

    final String PICTURES_PATH = "src/main/resources/static/pictures/boat/";

    @Transactional
    public void add(BoatDTO dto, MultipartFile[] multipartFiles, Principal userP) throws IOException {
        Boat boat = dtoToBoat(dto);
        List<Tag> additionalServices = tagService.getAdditionalServicesFromDTO(dto.getAdditionalServices());
        boat.setAdditionalServices(additionalServices);
        List<String> paths = addPictures(boat, multipartFiles);
        boat.setPictures(paths);
        boat.setProfilePicture(paths.get(0));
        BoatOwner owner = (BoatOwner) personRepository.findByUsername(userP.getName());
        boat.setBoatOwner(owner);
        owner.getBoats().add(boat);
        boatRepository.save(boat);
    }

    @Transactional
    public boolean deleteBoat(Long id, Principal userP) {
        Boat boat = boatRepository.getById(id);
        BoatOwner owner;
        try {
            owner = (BoatOwner) personRepository.findByUsername(userP.getName());
        } catch (ClassCastException e) {    // In ADMIN case
            owner = boat.getBoatOwner();
        }
        if (boat.getBoatOwner() == owner && (reservationRepository.getActiveReservations(id).size()) == 0) {
            owner.getBoats().remove(boat);
            boatRepository.delete(boat);
            return true;
        }
        return false;
    }

    public List<BoatDTO> findOwnerBoats(Long id) {
        List<BoatDTO> boatsDTO = new ArrayList<>();
        for (Boat boat : boatRepository.findOwnerBoats(id)) {
            boatsDTO.add(new BoatDTO(boat));
        }
        return boatsDTO;
    };

    public List<BoatDTO> getAvailableBoats(String startDate, String endDate, Integer capacity) {
        LocalDateTime startDateTime = LocalDateTime.ofInstant(Instant.parse(startDate), ZoneOffset.UTC);
        LocalDateTime endDateTime = LocalDateTime.ofInstant(Instant.parse(endDate), ZoneOffset.UTC);

        List<BoatDTO> boatsDTO = new ArrayList<>();
        for (Boat boat: boatRepository.findAll()) {
            if (boat.getCapacity() >= capacity) {
                for (Period period : boat.getPeriods()) {
                    if ((startDateTime.isAfter(period.getStartDateTime()) || startDateTime.isEqual(period.getStartDateTime())) && (endDateTime.isBefore(period.getEndDateTime()) || endDateTime.isEqual(period.getEndDateTime()))) {
                        boatsDTO.add(new BoatDTO(boat));
                        break;
                    }
                }
            }
        }
        return boatsDTO;
    }

    public List<BoatDTO> getAvailableBoatsByCityAndCapacity(String city, Integer capacity, String startDate, String endDate) {
        List<BoatDTO> boatsDTO = new ArrayList<>();
        for (BoatDTO boat: getAvailableBoats(startDate, endDate, capacity))
            if (boat.getAddress().getCity().equals(city))
                boatsDTO.add(boat);
        return boatsDTO;
    }


    public List<String> addPictures(Boat boat, MultipartFile[] multipartFiles) throws IOException {
        List<String> paths = new ArrayList<>();

        if(multipartFiles == null) {
            return paths;
        }
        Path path = Paths.get(PICTURES_PATH + boat.getId());
        savePicturesOnPath(boat, multipartFiles, paths, path);
        return paths.stream().distinct().collect(Collectors.toList());
    }

    public List<String> getPhotos(Boat boat) throws IOException {
        List<String> photos = new ArrayList<>();
        for (String photo : boat.getPictures()) {
            Path path = Paths.get(photo);
            byte[] bytes = Files.readAllBytes(path);
            String photoData = Base64.getEncoder().encodeToString(bytes);
            photos.add(photoData);
        }
        return photos;
    }

    private void savePicturesOnPath(Boat boat, MultipartFile[] multipartFiles, List<String> paths, Path path) throws IOException {
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        for (MultipartFile mpf : multipartFiles) {
            String fileName = mpf.getOriginalFilename();
            try (InputStream inputStream = mpf.getInputStream()) {
                Path filePath = path.resolve(fileName);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                paths.add(PICTURES_PATH + boat.getId() + "/" + fileName);
            } catch (IOException ioe) {
                throw new IOException("Could not save image file: " + fileName, ioe);
            }
        }
    }



    public void edit(BoatDTO dto, Long id) {
        Boat boat = boatRepository.findById(id).orElse(null);
        boat.setName(dto.getName());
        boat.setAddress(dto.getAddress());
        boat.setPromotionalDescription(dto.getPromotionalDescription());
        boat.setRules(dto.getRules());
        boat.getPriceList().setHourlyRate(dto.getHourlyRate());
        boat.getPriceList().setDailyRate(dto.getDailyRate());
        boat.getPriceList().setCancellationConditions(dto.getCancellationConditions());
        boatRepository.save(boat);
    }

    public Boat findOne(Long id) {
        return boatRepository.findById(id).orElse(null);
    }

    public List<Boat> findAll() {
        return boatRepository.findAll();
    }

    private Boat dtoToBoat(BoatDTO dto) {
        Boat boat = new Boat();
        boat.setName(dto.getName());
        Address address = dto.getAddress();
        addressRepository.save(address);
        boat.setAddress(address);
        boat.setPromotionalDescription(dto.getPromotionalDescription());
        boat.setRules(dto.getRules());
        PriceList priceList = new PriceList();
        priceList.setHourlyRate(dto.getHourlyRate());
        priceList.setDailyRate(dto.getDailyRate());
        priceList.setCancellationConditions(dto.getCancellationConditions());
        priceListRepository.save(priceList);
        boat.setPriceList(priceList);
        boat.setRating(0.0);
        boat.setType(BoatType.valueOf(dto.getType()));
        boat.setEnginesNumber(dto.getEnginesNumber());
        boat.setEnginePower(dto.getEnginePower());
        boat.setMaxSpeed(dto.getMaxSpeed());
        boat.setCapacity(dto.getCapacity());
        boat.setNavigationEquipment(dto.getNavigationEquipment());
        boat.setFishingEquipment(dto.getFishingEquipment());
        return boat;
    }
}
