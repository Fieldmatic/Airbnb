package mrsisa.project.service;

import mrsisa.project.dto.AdventureDTO;
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
public class AdventureService {

    @Autowired
    private AdventureRepository adventureRepository;

    @Autowired
    private PriceListRepository priceListRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private TagService tagService;

    @Autowired
    private PictureService pictureService;

    final static String PICTURES_PATH = "src/main/resources/static/pictures/adventure/";

    public Adventure save(Adventure adventure) {
        return adventureRepository.save(adventure);
    }

    @Transactional
    public void add(AdventureDTO adventureDTO, MultipartFile[] multipartFiles, Principal userP) throws IOException {
        Adventure adventure = this.dtoToAdventure(adventureDTO);
        adventureRepository.save(adventure);
        List<Tag> additionalServices = tagService.getAdditionalServicesFromDTO(adventureDTO.getAdditionalServices(), adventure);
        adventure.setAdditionalServices(additionalServices);
        List<String> paths = pictureService.addPictures(adventure.getId(), PICTURES_PATH, multipartFiles);
        adventure.setPictures(paths);
        adventure.setProfilePicture(paths.get(0));
        Instructor instructor = (Instructor) personRepository.findByUsername(userP.getName());
        adventure.setInstructor(instructor);
        adventureRepository.save(adventure);
        instructor.getAdventures().add(adventure);
        instructorRepository.save(instructor);
    }


    @Cacheable(value = "bookableId", key = "#id",unless="#result == null")
    public Adventure findOne(Long id) {
        return adventureRepository.getById(id);
    }

    public Integer getNumberOfReviews(Long id) {
        Adventure adventure = adventureRepository.findByIdWithReviews(id);
        int i = 0;
        for (Review review : adventure.getReviews()) {
            if (review.isAnswered()) i++;
        }
        return i;
    }

    public List<Adventure> findAll() {
        return adventureRepository.findAll();
    }

    @Transactional
    public List<AdventureDTO> getAvailableAdventures(String startDate, String endDate, Integer capacity) {
        LocalDateTime startDateTime = LocalDateTime.ofInstant(Instant.parse(startDate), ZoneOffset.UTC);
        LocalDateTime endDateTime = LocalDateTime.ofInstant(Instant.parse(endDate), ZoneOffset.UTC);

        List<AdventureDTO> adventuresDTO = new ArrayList<>();
        for (Adventure adventure : adventureRepository.findAll()) {
            if (adventure.getCapacity() >= capacity) {
                for (Period period : adventure.getPeriods()) {
                    if ((startDateTime.isAfter(period.getStartDateTime()) || startDateTime.isEqual(period.getStartDateTime())) && (endDateTime.isBefore(period.getEndDateTime()) || endDateTime.isEqual(period.getEndDateTime()))) {
                        adventuresDTO.add(new AdventureDTO(adventure));
                        break;
                    }
                }
            }
        }
        return adventuresDTO;
    }

    public List<String> getPhotos(Adventure adventure) throws IOException {
        List<String> photos = new ArrayList<>();
        for (String photo : adventure.getPictures()) {
            Path path = Paths.get(photo);
            byte[] bytes = Files.readAllBytes(path);
            String photoData = Base64.getEncoder().encodeToString(bytes);
            photos.add(photoData);
        }
        return photos;
    }

    @Transactional
    public List<AdventureDTO> getAvailableAdventuresByCityAndCapacity(String city, Integer capacity, String startDate, String endDate) {
        List<AdventureDTO> adventuresDTO = new ArrayList<>();
        for (AdventureDTO adventure : getAvailableAdventures(startDate, endDate, capacity))
            if (adventure.getAddress().getCity().equals(city))
                adventuresDTO.add(adventure);
        return adventuresDTO;
    }

    private Adventure dtoToAdventure(AdventureDTO dto) {
        Adventure adventure = new Adventure();
        adventure.setName(dto.getName());
        Address address = dto.getAddress();
        addressRepository.save(address);
        adventure.setAddress(address);
        adventure.setPromotionalDescription(dto.getPromotionalDescription());
        adventure.setRules(dto.getRules());
        PriceList priceList = new PriceList();
        priceList.setHourlyRate(dto.getHourlyRate());
        priceList.setCancellationConditions(dto.getCancellationConditions());
        priceListRepository.save(priceList);
        adventure.setPriceList(priceList);
        adventure.setRating(0.0);
        adventure.setCapacity(dto.getCapacity());
        adventure.setFishingEquipment(dto.getEquipment());
        // Po potrebi dodati kreiranje perioda zauzetosti
        return adventure;
    }

    @Transactional
    public boolean deleteAdventure(Long id, Principal userP) {
        Adventure adventure = adventureRepository.getById(id);
        Instructor instructor;
        try {
            instructor = (Instructor) personRepository.findByUsername(userP.getName());
        } catch (ClassCastException e) {    // In ADMIN case
            instructor = adventure.getInstructor();
        }
        if (adventure.getInstructor() == instructor && (reservationRepository.getActiveReservations(id).size()) == 0) {
            instructor.getAdventures().remove(adventure);
            tagService.removeRelationships(adventure);
            adventureRepository.delete(adventure);
            return true;
        }
        return false;
    }

    public List<AdventureDTO> getInstructorAdventures(Long id) {
        List<AdventureDTO> adventureDTOS = new ArrayList<>();
        for (Adventure adventure : adventureRepository.findAdventuresByInstructor_Id(id)) {
            adventureDTOS.add(new AdventureDTO(adventure));
        }
        return adventureDTOS;
    }

    @Transactional
    public boolean edit(AdventureDTO dto, Long id, Optional<MultipartFile[]> newPhotos) throws IOException {
        Adventure adventure = adventureRepository.findByIdWithReservations(id);
        if ((reservationRepository.getActiveReservations(id).size()) != 0) return false;
        pictureService.handleDeletedPictures(adventure, dto.getPhotos());
        if (newPhotos.isPresent()) {
            List<String> paths = pictureService.addPictures(adventure.getId(), PICTURES_PATH, newPhotos.get());
            adventure.getPictures().addAll(paths);
            if (adventure.getProfilePicture() == null) adventure.setProfilePicture(paths.get(0));
        }
        adventure.setName(dto.getName());
        adventure.getAddress().setState(dto.getAddress().getState());
        adventure.getAddress().setCity(dto.getAddress().getCity());
        adventure.getAddress().setStreet(dto.getAddress().getStreet());
        adventure.getAddress().setZipCode(dto.getAddress().getZipCode());
        addressRepository.save(adventure.getAddress());
        adventure.setPromotionalDescription(dto.getPromotionalDescription());
        adventure.setRules(dto.getRules());
        adventure.setCapacity(dto.getCapacity());
        adventure.getPriceList().setHourlyRate(dto.getHourlyRate());
        adventure.setFishingEquipment(dto.getEquipment());
        adventure.getPriceList().setCancellationConditions(dto.getCancellationConditions());
        priceListRepository.save(adventure.getPriceList());

        tagService.setNewAdditionalServices(dto.getAdditionalServices(), adventure);
        handleDeletedTags(adventure, dto.getAdditionalServices());
        adventureRepository.save(adventure);
        return true;

    }

    private void handleDeletedTags(Adventure adventure, List<String> additionalServices) {
        for (int i = adventure.getAdditionalServices().size() - 1; i >= 0; --i) {
            if (!(additionalServices.contains(adventure.getAdditionalServices().get(i).getName()))) {
                tagService.removeRelationship(adventure, adventure.getAdditionalServices().get(i));
                adventure.getAdditionalServices().remove(adventure.getAdditionalServices().get(i));
            }
        }

    }

    public AdventureDTO getAdventure(Long id) throws IOException {
        Adventure adventure = adventureRepository.findById(id).orElse(null);
        if (adventure == null) return null;
        List<String> adventurePhotos = getPhotos(adventure);
        adventure.setPictures(adventurePhotos);
        return new AdventureDTO(adventure);
    }

}
