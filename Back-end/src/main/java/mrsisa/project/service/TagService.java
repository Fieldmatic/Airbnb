package mrsisa.project.service;

import mrsisa.project.model.Tag;
import mrsisa.project.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TagService {
    @Autowired
    TagRepository tagRepository;

    public List<Tag> getAdditionalServicesFromDTO(List<String> additionalServices){
        List<Tag> tags = new ArrayList<>();
        for (String tag : additionalServices) {
            Tag t = new Tag();
            t.setName(tag);
            tagRepository.save(t);
            tags.add(t);
        }
        return tags;
    }
}
