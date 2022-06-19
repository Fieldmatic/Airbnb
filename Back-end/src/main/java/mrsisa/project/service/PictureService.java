package mrsisa.project.service;

import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.Bookable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PictureService {
    public List<String> addPictures(Long id,String PICTURES_PATH, MultipartFile[] multipartFiles) throws IOException {
        List<String> paths = new ArrayList<>();

        if(multipartFiles == null) {
            return paths;
        }
        Path path = Paths.get(PICTURES_PATH + id);
        savePicturesOnPath(id, PICTURES_PATH,multipartFiles, paths, path);
        return paths.stream().distinct().collect(Collectors.toList());
    }

    private void savePicturesOnPath(Long id,String PICTURES_PATH, MultipartFile[] multipartFiles, List<String> paths, Path path) throws IOException {
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        for (MultipartFile mpf : multipartFiles) {
            String fileName = mpf.getOriginalFilename();
            try (InputStream inputStream = mpf.getInputStream()) {
                Path filePath = path.resolve(fileName);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                paths.add(PICTURES_PATH + id + "/" + fileName);
            } catch (IOException ioe) {
                throw new IOException("Could not save image file: " + fileName, ioe);
            }
        }
    }

    public void handleDeletedPictures(Bookable bookable, List<String> newPicturesList) throws IOException {
        for(int i = bookable.getPictures().size() - 1; i >= 0; --i) {
            Path path = Paths.get(bookable.getPictures().get(i));
            byte[] bytes = Files.readAllBytes(path);
            String photoData = Base64.getEncoder().encodeToString(bytes);
            if (!newPicturesList.contains(photoData)) {
                bookable.getPictures().remove(bookable.getPictures().get(i));
                Files.delete(path);
            }
        }
    }
}
