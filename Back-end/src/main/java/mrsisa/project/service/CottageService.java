package mrsisa.project.service;

import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.*;


@Service
public class CottageService {

    @Autowired
    CottageRepository cottageRepository;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    PriceListRepository priceListRepository;

    @Autowired
    CottageOwnerRepository cottageOwnerRepository;

    @Autowired
    PersonRepository personRepository;

    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    TagService tagService;

    @Autowired
    PictureService pictureService;

    private final String picturesPath = "src/main/resources/static/pictures/cottage/";


    public void add(CottageDTO dto, Optional<MultipartFile[]> photoFiles, Principal userP) throws IOException {
        Cottage cottage = dtoToCottage(dto);
        cottageRepository.save(cottage);
        List<String> paths = new ArrayList<>();
        if (photoFiles.isPresent()){
            paths = pictureService.addPictures(cottage.getId(), picturesPath, photoFiles.get());
            cottage.setProfilePicture(paths.get(0));
        }
        cottage.setPictures(paths);
        CottageOwner owner = cottageOwnerRepository.findByUsername(userP.getName());
        cottage.setCottageOwner(owner);
        List<Tag> additionalServices = tagService.getAdditionalServicesFromDTO(dto.getAdditionalServices(), cottage);
        cottage.setAdditionalServices(additionalServices);
        cottageRepository.save(cottage);
        owner.getCottages().add(cottage);
    }

    public List<CottageDTO> getDTOCottages() throws IOException {
        List<Cottage> cottages = cottageRepository.findAll();
        List<CottageDTO> cottagesDTO = new ArrayList<>();
        for (Cottage cottage : cottages) {
            List<String> cottagePhotos = getPhotos(cottage);
            cottage.setPictures(cottagePhotos);
            cottagesDTO.add(new CottageDTO(cottage));
        }
        return cottagesDTO;
    }

    public Integer getNumberOfReviews(Long id) {
        Cottage cottage = cottageRepository.findByIdWithReviews(id);
        return cottage.getReviews().size();
    }

    public List<CottageDTO> findAll() {
        List<CottageDTO> cottagesDTO = new ArrayList<>();
        for (Cottage cottage : cottageRepository.findAll()) {
            cottagesDTO.add(new CottageDTO(cottage));
        }
        return cottagesDTO;
    }


    @Transactional
    public List<CottageDTO> getAvailableCottages(String startDate, String endDate) {
        LocalDateTime startDateTime = LocalDateTime.ofInstant(Instant.parse(startDate), ZoneOffset.UTC);
        LocalDateTime endDateTime = LocalDateTime.ofInstant(Instant.parse(endDate), ZoneOffset.UTC);

        List<CottageDTO> cottagesDTO = new ArrayList<>();
        for (Cottage cottage: cottageRepository.findAll()) {
            for (Period period : cottage.getPeriods()) {
                if ((startDateTime.isAfter(period.getStartDateTime()) || startDateTime.isEqual(period.getStartDateTime())) && (endDateTime.isBefore(period.getEndDateTime()) || endDateTime.isEqual(period.getEndDateTime()))) {
                    cottagesDTO.add(new CottageDTO(cottage));
                    break;
                }
            }
        }
        return cottagesDTO;
    }

    @Transactional
    public List<CottageDTO> getAvailableCottagesByCity(String city, String startDate, String endDate) {
        List<CottageDTO> cottagesDTO = new ArrayList<>();
        for (CottageDTO cottage: getAvailableCottages(startDate, endDate))
            if (cottage.getAddress().getCity().equals(city))
                cottagesDTO.add(cottage);
        return cottagesDTO;
    }

    public List<String> getPhotos(Cottage cottage) throws IOException {
        List<String> photos = new ArrayList<>();
        for (String photo : cottage.getPictures()) {
            Path path = Paths.get(photo);
            byte[] bytes = Files.readAllBytes(path);
            String photoData = Base64.getEncoder().encodeToString(bytes);
            photos.add(photoData);
        }
        return photos;
    }

    public List<CottageDTO> findOwnerCottages(Long id) {
        List<CottageDTO> cottagesDTO = new ArrayList<>();
        for (Cottage cottage : cottageRepository.findAllByCottageOwner_Id(id)) {
            cottagesDTO.add(new CottageDTO(cottage));
        }
        return cottagesDTO;
    }

    public CottageDTO getCottage(Long id) throws IOException {
        Cottage cottage = cottageRepository.findById(id).orElse(null);
        if (cottage == null) return null;
        List<String> cottagePhotos = getPhotos(cottage);
        cottage.setPictures(cottagePhotos);
        return new CottageDTO(cottage);
    }

    @Transactional
    public boolean deleteCottage(Long id, Principal userP) {
        Cottage cottage = cottageRepository.getById(id);
        CottageOwner owner;
        try {
            owner = (CottageOwner) personRepository.findByUsername(userP.getName());
        } catch (ClassCastException e) {    // In ADMIN case
            owner = cottage.getCottageOwner();
        }
        if (cottage.getCottageOwner() == owner && (reservationRepository.getActiveReservations(id).size()) == 0) {
            owner.getCottages().remove(cottage);
            cottageRepository.delete(cottage);
            return true;
        }
        return false;
    }
    @Transactional
    public boolean edit(CottageDTO dto, Long id, Optional<MultipartFile[]> newPhotos) throws IOException {
        Cottage cottage = cottageRepository.findByIdWithReservations(id);
        if ((reservationRepository.getActiveReservations(id).size())!= 0) return false;
        pictureService.handleDeletedPictures(cottage, dto.getPhotos());
        if (newPhotos.isPresent())
        {
            List<String> paths = pictureService.addPictures(cottage.getId(), picturesPath, newPhotos.get());
            cottage.getPictures().addAll(paths);
            if (cottage.getProfilePicture() == null) cottage.setProfilePicture(paths.get(0));
        }
        cottage.setName(dto.getName());
        cottage.getAddress().setState(dto.getAddress().getState());
        cottage.getAddress().setCity(dto.getAddress().getCity());
        cottage.getAddress().setStreet(dto.getAddress().getStreet());
        cottage.getAddress().setZipCode(dto.getAddress().getZipCode());
        addressRepository.save(cottage.getAddress());
        cottage.setPromotionalDescription(dto.getPromotionalDescription());
        cottage.setRules(dto.getRules());
        cottage.getPriceList().setHourlyRate(dto.getHourlyRate());
        cottage.getPriceList().setDailyRate(dto.getDailyRate());
        cottage.getPriceList().setCancellationConditions(dto.getCancellationConditions());
        priceListRepository.save(cottage.getPriceList());
        cottage.setCapacity(0);
        if (dto.getSingleRooms() != 0) {cottage.getRooms().put(1,dto.getSingleRooms()); cottage.setCapacity(cottage.getCapacity() + dto.getSingleRooms());}
        if (dto.getDoubleRooms() != 0) {cottage.getRooms().put(2,dto.getDoubleRooms()); cottage.setCapacity(cottage.getCapacity() + dto.getDoubleRooms() * 2);}
        if (dto.getTripleRooms() != 0) {cottage.getRooms().put(3,dto.getTripleRooms()); cottage.setCapacity(cottage.getCapacity() + dto.getTripleRooms() * 3);}
        if (dto.getQuadRooms() != 0) {cottage.getRooms().put(4,dto.getQuadRooms()); cottage.setCapacity(cottage.getCapacity() + dto.getQuadRooms() *4);}
        tagService.setNewAdditionalServices(dto.getAdditionalServices(), cottage);
        handleDeletedTags(cottage,dto.getAdditionalServices());
        cottageRepository.save(cottage);
        return true;
    }

    private void handleDeletedTags(Cottage cottage,List<String> additionalServices){

        for(int i = cottage.getAdditionalServices().size() - 1; i >= 0; --i)
        {
            if (!(additionalServices.contains(cottage.getAdditionalServices().get(i).getName()))){
                tagService.removeRelationship(cottage, cottage.getAdditionalServices().get(i));
                cottage.getAdditionalServices().remove(cottage.getAdditionalServices().get(i));
            }
        }

    }

    public Cottage findOne(Long id) {
        return cottageRepository.findById(id).orElse(null);
    }


    private Cottage dtoToCottage(CottageDTO dto) {
        Cottage cottage = new Cottage();
        cottage.setName(dto.getName());
        cottage.setAddress(dto.getAddress());
        cottage.setPromotionalDescription(dto.getPromotionalDescription());
        cottage.setRules(dto.getRules());
        PriceList priceList = new PriceList();
        priceList.setHourlyRate(dto.getHourlyRate());
        priceList.setDailyRate(dto.getDailyRate());
        priceList.setCancellationConditions(dto.getCancellationConditions());
        cottage.setPriceList(priceList);
        cottage.setRating(0.0);
        Map<Integer,Integer> rooms = new HashMap<>();
        cottage.setRooms(rooms);
        cottage.setCapacity(0);
        if (dto.getSingleRooms() != 0) {cottage.getRooms().put(1,dto.getSingleRooms()); cottage.setCapacity(cottage.getCapacity() + dto.getSingleRooms());}
        if (dto.getDoubleRooms() != 0) {cottage.getRooms().put(2,dto.getDoubleRooms()); cottage.setCapacity(cottage.getCapacity() + dto.getDoubleRooms() * 2);}
        if (dto.getTripleRooms() != 0) {cottage.getRooms().put(3,dto.getTripleRooms()); cottage.setCapacity(cottage.getCapacity() + dto.getTripleRooms() * 3);}
        if (dto.getQuadRooms() != 0) {cottage.getRooms().put(4,dto.getQuadRooms()); cottage.setCapacity(cottage.getCapacity() + dto.getQuadRooms() *4);}
        return cottage;
    }

    public Cottage createFirstCottage() {
        Address address = new Address();
        address.setZipCode("36000");
        address.setStreet("Nikole Tesle 5");
        address.setState("BiH");
        address.setCity("Bijeljina");

        Cottage cottage = new Cottage();
        cottage.setName("Vikendica na Drini");
        cottage.setAddress(address);
        cottage.setPromotionalDescription("Nema");
        cottage.setProfilePicture(null);
        cottage.setRules("Nema");
        cottage.setRating(8.3);
        cottage.setCapacity(3);

        List<Tag> additionalServices = new ArrayList<>();
        additionalServices.add(new Tag("wiFi"));
        additionalServices.add(new Tag("washing machine"));
        additionalServices.add(new Tag("terrace"));
        additionalServices.add(new Tag("coffee maker"));
        additionalServices.add(new Tag("tea maker"));
        additionalServices.add(new Tag("heating"));
        additionalServices.add(new Tag("towels"));
        additionalServices.add(new Tag("hairdryer"));
        additionalServices.add(new Tag("toilet paper"));
        additionalServices.add(new Tag("flat-screen TV"));


        PriceList priceList = new PriceList();
        priceList.setHourlyRate(1400.00);
        priceList.setDailyRate(3000.00);
        priceList.setCancellationConditions("Nema uslova");

        priceList.setBookable(cottage);

        cottage.setPriceList(priceList);
        cottage.setAdditionalServices(additionalServices);

        cottageRepository.save(cottage);
        return cottage;
    }

}
