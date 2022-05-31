package mrsisa.project.service;

import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
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
import java.util.*;
import java.util.stream.Collectors;


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

    final String PICTURES_PATH = "src/main/resources/static/pictures/cottage/";

    @Transactional
    public void add(CottageDTO dto, MultipartFile[] multipartFiles, Principal userP) throws IOException {
        Cottage cottage = dtoToCottage(dto);
        List<String> paths = addPictures(cottage, multipartFiles);
        cottage.setPictures(paths);
        cottage.setProfilePicture(paths.get(0));
        CottageOwner owner = (CottageOwner) personRepository.findByUsername(userP.getName());
        cottage.setCottageOwner(owner);
        owner.getCottages().add(cottage);
        cottageOwnerRepository.save(owner);
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
        Cottage cottage = findOne(id);
        return cottage.getReviews().size();
    }

    public List<String> addPictures(Cottage cottage, MultipartFile[] multipartFiles) throws IOException {
        List<String> paths = new ArrayList<>();

        if(multipartFiles == null) {
            return paths;
        }
        Path path = Paths.get(PICTURES_PATH + cottage.getId());
        savePicturesOnPath(cottage, multipartFiles, paths, path);
        return paths.stream().distinct().collect(Collectors.toList());
    }

    private void savePicturesOnPath(Cottage cottage, MultipartFile[] multipartFiles, List<String> paths, Path path) throws IOException {
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        for (MultipartFile mpf : multipartFiles) {
            String fileName = mpf.getOriginalFilename();
            try (InputStream inputStream = mpf.getInputStream()) {
                Path filePath = path.resolve(fileName);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                paths.add(PICTURES_PATH + cottage.getId() + "/" + fileName);
            } catch (IOException ioe) {
                throw new IOException("Could not save image file: " + fileName, ioe);
            }
        }
    }

    public List<CottageDTO> findAll() {
        List<CottageDTO> cottagesDTO = new ArrayList<>();
        for (Cottage cottage : cottageRepository.findAll()) {
            cottagesDTO.add(new CottageDTO(cottage));
        }
        return cottagesDTO;
    }

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

    // public List<Cottage> findAll() {
    //     return cottageRepository.findAll();
    // }

    public List<CottageDTO> findOwnerCottages(Long id) {
        List<CottageDTO> cottagesDTO = new ArrayList<>();
        for (Cottage cottage : cottageRepository.findOwnerCottages(id)) {
            cottagesDTO.add(new CottageDTO(cottage));
        }
        return cottagesDTO;
    };

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

    public void edit(CottageDTO dto, Long id) {
        Cottage cottage = cottageRepository.findById(id).orElse(null);
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
        if (dto.getSingleRooms() != 0) cottage.getRooms().put(1,dto.getSingleRooms());
        if (dto.getDoubleRooms() != 0) cottage.getRooms().put(2,dto.getDoubleRooms());
        if (dto.getTripleRooms() != 0) cottage.getRooms().put(3,dto.getTripleRooms());
        if (dto.getQuadRooms() != 0) cottage.getRooms().put(4,dto.getQuadRooms());
        cottageRepository.save(cottage);
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
        if (dto.getSingleRooms() != 0) rooms.put(1,dto.getSingleRooms());
        if (dto.getDoubleRooms() != 0) rooms.put(2,dto.getDoubleRooms());
        if (dto.getTripleRooms() != 0) rooms.put(3,dto.getTripleRooms());
        if (dto.getQuadRooms() != 0) rooms.put(4,dto.getQuadRooms());
        cottage.setRooms(rooms);

        return cottage;
    }

}
