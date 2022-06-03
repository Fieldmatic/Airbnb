package mrsisa.project.service;

import mrsisa.project.model.Bookable;
import mrsisa.project.model.Cottage;
import mrsisa.project.model.Tag;
import mrsisa.project.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TagService {
    
    @Autowired
    TagRepository tagRepository;

    public List<Tag> getAdditionalServicesFromDTO(List<String> additionalServices, Bookable bookable){
        List<Tag> tags = new ArrayList<>();
        for (String tagName : additionalServices) {
            Optional<Tag> tag = tagRepository.findByName(tagName);
            if (tag.isPresent()) {
                tag.get().getBookables().add(bookable);
                tags.add(tag.get());
            } else {
                Tag newTag = new Tag(tagName, bookable);
                tagRepository.save(newTag);
                tags.add(newTag);
            }
        }
        return tags;
    }

    public List<Tag> getAdditionalServicesOfBookable(Long id) {
        return tagRepository.getTagsOfBookable(id);
    }
}
