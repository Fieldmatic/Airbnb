package mrsisa.project.service;

import mrsisa.project.model.Bookable;
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
            Optional<Tag> tag = Optional.ofNullable(tagRepository.getByNameWithBookables(tagName));
            if (tag.isPresent()) {
                if (!(tag.get().getBookables().contains(bookable)))  tag.get().getBookables().add(bookable);
                tags.add(tag.get());
            } else {
                Tag newTag = new Tag(tagName, bookable);
                tagRepository.save(newTag);
                tags.add(newTag);
            }
        }
        return tags;
    }

    public List<Tag> getExistingAdditionalServices(List<String> additionalServices) {
        List<Tag> tags = new ArrayList<>();
        for (String tagName : additionalServices) {
            tags.add(tagRepository.findTagByName(tagName));
        }
        return tags;
    }

    public void setNewAdditionalServices(List<String> additionalServices, Bookable bookable){
        for (String tagName : additionalServices) {
            Optional<Tag> tag = Optional.ofNullable(tagRepository.getByNameWithBookables(tagName));
            if (tag.isPresent() && (!(tag.get().getBookables().contains(bookable)))) {
                tag.get().getBookables().add(bookable);
                bookable.getAdditionalServices().add(tag.get());
            } else if (!tag.isPresent()){
                Tag newTag = new Tag(tagName, bookable);
                tagRepository.save(newTag);
                bookable.getAdditionalServices().add(newTag);
            }
        }
    }

    public void saveTags(List<Tag> tags){
        tagRepository.saveAll(tags);
    }

    public void removeRelationships(Bookable bookable){
        List<Tag> tagsWithRelationship = tagRepository.findByBookableId(bookable.getId());
        for(Tag tag : tagsWithRelationship) {
            tag.getBookables().remove(bookable);
            tagRepository.save(tag);
        }

    }

    public void removeRelationship(Bookable bookable, Tag tag){
        tag.getBookables().remove(bookable);
        tagRepository.save(tag);
    }

    public List<Tag> getAdditionalServicesOfBookable(Long id) {
        return tagRepository.getTagsOfBookable(id);
    }
}
