package mrsisa.project.service;

import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.Client;
import mrsisa.project.model.Cottage;
import mrsisa.project.model.PriceList;
import mrsisa.project.repository.CottageRepository;
import mrsisa.project.repository.PriceListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class CottageService {

    @Autowired
    CottageRepository cottageRepository;

    @Autowired
    PriceListRepository priceListRepository;

    final String PICTURES_PATH = "src/main/resources/static/pictures/cottage/";

    public void add(CottageDTO dto, MultipartFile[] multipartFiles) throws IOException {
        Cottage cottage = dtoToCottage(dto);
        cottageRepository.save(cottage);
        List<String> paths = addPictures(cottage, multipartFiles);
        cottage.setPictures(paths);
        cottage.setProfilePicture(paths.get(0));
        cottageRepository.save(cottage);
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

    public List<Cottage> findAll() {
        return cottageRepository.findAll();
    }

    public void edit(CottageDTO dto, Long id) {
        Cottage cottage = cottageRepository.findById(id).orElse(null);
        cottage.setName(dto.getName());
        cottage.setAddress(dto.getAddress());
        cottage.setPromotionalDescription(dto.getPromotionalDescription());
        cottage.setRules(dto.getRules());
        cottage.getPriceList().setHourlyRate(dto.getHourlyRate());
        cottage.getPriceList().setDailyRate(dto.getDailyRate());
        cottage.getPriceList().setCancellationConditions(dto.getCancellationConditions());
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
        priceListRepository.save(priceList);
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
