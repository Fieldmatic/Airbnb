package mrsisa.project.service;


import mrsisa.project.dto.BoatDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class BoatService {
    @Autowired
    BoatRepository boatRepository;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    PriceListRepository priceListRepository;

    @Autowired
    BoatOwnerRepository boatOwnerRepository;

    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    TagService tagService;

    @Autowired
    PictureService pictureService;

    final static String picturesPath = "src/main/resources/static/pictures/boat/";


    public void add(BoatDTO dto, Optional<MultipartFile[]> photoFiles, Principal userP) throws IOException {
        Boat boat = dtoToBoat(dto);
        boatRepository.save(boat);
        List<String> photoPaths = new ArrayList<>();
        if (photoFiles.isPresent()){
            photoPaths = pictureService.addPictures(boat.getId(),picturesPath, photoFiles.get());
            boat.setProfilePicture(photoPaths.get(0));
        }
        boat.setPictures(photoPaths);
        BoatOwner owner = boatOwnerRepository.findByUsername(userP.getName());
        boat.setBoatOwner(owner);
        List<Tag> additionalServices = tagService.getAdditionalServicesFromDTO(dto.getAdditionalServices(), boat);
        boat.setAdditionalServices(additionalServices);
        boatRepository.save(boat);
        owner.getBoats().add(boat);
    }

    public BoatDTO getBoat(Long id) throws IOException {
        Boat boat = boatRepository.findById(id).orElse(null);
        if (boat == null) return null;
        List<String> cottagePhotos = getPhotos(boat);
        boat.setPictures(cottagePhotos);
        return new BoatDTO(boat);
    }

    @Transactional
    public boolean deleteBoat(Long id, Principal userP) {
        Boat boat = boatRepository.getById(id);
        BoatOwner owner;
        try {
            owner = boatOwnerRepository.findByUsername(userP.getName());
        } catch (ClassCastException e) {    // In ADMIN case
            owner = boat.getBoatOwner();
        }
        if (boat.getBoatOwner() == owner && (reservationRepository.getActiveReservations(id).size()) == 0) {
            owner.getBoats().remove(boat);
            tagService.removeRelationships(boat);
            boatRepository.delete(boat);
            return true;
        }
        return false;
    }


    public List<BoatDTO> findOwnerBoats(Long id) {
        List<BoatDTO> boatsDTO = new ArrayList<>();
        for (Boat boat : boatRepository.findBoatsByBoatOwner_Id(id)) {
            boatsDTO.add(new BoatDTO(boat));
        }
        return boatsDTO;
    }

    @Transactional
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

    @Transactional
    public List<BoatDTO> getAvailableBoatsByCityAndCapacity(String city, Integer capacity, String startDate, String endDate) {
        List<BoatDTO> boatsDTO = new ArrayList<>();
        for (BoatDTO boat: getAvailableBoats(startDate, endDate, capacity))
            if (boat.getAddress().getCity().equals(city))
                boatsDTO.add(boat);
        return boatsDTO;
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

    @Transactional
    public boolean edit(BoatDTO dto, Long id, Optional<MultipartFile[]> newPhotos) throws IOException {
        Boat boat = boatRepository.findByIdWithReservations(id);
        if ((reservationRepository.getActiveReservations(id).size())!= 0) return false;
        pictureService.handleDeletedPictures(boat, dto.getPhotos());
        if (newPhotos.isPresent())
        {
            List<String> paths = pictureService.addPictures(boat.getId(),picturesPath, newPhotos.get());
            boat.getPictures().addAll(paths);
            if (boat.getProfilePicture() == null) boat.setProfilePicture(paths.get(0));
        }

        boat.setName(dto.getName());
        boat.getAddress().setState(dto.getAddress().getState());
        boat.getAddress().setCity(dto.getAddress().getCity());
        boat.getAddress().setStreet(dto.getAddress().getStreet());
        boat.getAddress().setZipCode(dto.getAddress().getZipCode());
        addressRepository.save(boat.getAddress());
        boat.setPromotionalDescription(dto.getPromotionalDescription());
        boat.setRules(dto.getRules());
        boat.getPriceList().setHourlyRate(dto.getHourlyRate());
        boat.getPriceList().setDailyRate(dto.getDailyRate());
        boat.getPriceList().setCancellationConditions(dto.getCancellationConditions());
        priceListRepository.save(boat.getPriceList());
        boat.setCapacity(dto.getCapacity());
        boat.setType(BoatType.valueOf(dto.getType()));
        boat.setEnginesNumber(dto.getEnginesNumber());
        boat.setEnginePower(dto.getEnginePower());
        boat.setMaxSpeed(dto.getMaxSpeed());
        boat.setCapacity(dto.getCapacity());
        boat.setLength(dto.getLength());
        boat.setNavigationEquipment(dto.getNavigationEquipment());
        boat.setFishingEquipment(dto.getFishingEquipment());
        tagService.setNewAdditionalServices(dto.getAdditionalServices(), boat);
        handleDeletedTags(boat,dto.getAdditionalServices());
        boatRepository.save(boat);

        return true;

    }

    private void handleDeletedTags(Boat boat,List<String> additionalServices){

        for(int i = boat.getAdditionalServices().size() - 1; i >= 0; --i)
        {
            if (!(additionalServices.contains(boat.getAdditionalServices().get(i).getName()))){
                tagService.removeRelationship(boat, boat.getAdditionalServices().get(i));
                boat.getAdditionalServices().remove(boat.getAdditionalServices().get(i));
            }
        }

    }
    @Cacheable(value = "bookableId", key = "#id",unless="#result == null")
    public Boat findOne(Long id) {
        return boatRepository.findById(id).orElse(null);
    }

    public Integer getNumberOfReviews(Long id) {
        return boatRepository.findByIdWithReviews(id).getReviews().size();
    }

    public List<Boat> findAll() {
        return boatRepository.findAll();
    }

    private Boat dtoToBoat(BoatDTO dto) {
        Boat boat = new Boat();
        boat.setName(dto.getName());
        Address address = dto.getAddress();
        boat.setAddress(address);
        boat.setPromotionalDescription(dto.getPromotionalDescription());
        boat.setRules(dto.getRules());
        PriceList priceList = new PriceList();
        priceList.setHourlyRate(dto.getHourlyRate());
        priceList.setDailyRate(dto.getDailyRate());
        priceList.setCancellationConditions(dto.getCancellationConditions());
        boat.setPriceList(priceList);
        boat.setRating(0.0);
        boat.setType(BoatType.valueOf(dto.getType()));
        boat.setEnginesNumber(dto.getEnginesNumber());
        boat.setEnginePower(dto.getEnginePower());
        boat.setLength(dto.getLength());
        boat.setMaxSpeed(dto.getMaxSpeed());
        boat.setCapacity(dto.getCapacity());
        boat.setNavigationEquipment(dto.getNavigationEquipment());
        boat.setFishingEquipment(dto.getFishingEquipment());
        return boat;
    }
}
