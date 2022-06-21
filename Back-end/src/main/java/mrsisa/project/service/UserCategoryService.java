package mrsisa.project.service;

import mrsisa.project.model.CategoryName;
import mrsisa.project.model.UserCategory;
import mrsisa.project.repository.UserCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserCategoryService {

    @Autowired
    private UserCategoryRepository userCategoryRepository;

    public UserCategory getRegularCategory() {
        return userCategoryRepository.getRegularCategory();
    }

    public UserCategory getBronzeCategory() {
        return userCategoryRepository.getBronzeCategory();
    }

    public UserCategory getSilverCategory() {
        return userCategoryRepository.getSilverCategory();
    }

    public UserCategory getGoldCategory() {
        return userCategoryRepository.getGoldCategory();
    }

    public UserCategory save(UserCategory category) {
        return userCategoryRepository.save(category);
    }
}
