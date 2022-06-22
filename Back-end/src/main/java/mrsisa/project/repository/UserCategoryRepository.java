package mrsisa.project.repository;

import mrsisa.project.model.Bookable;
import mrsisa.project.model.UserCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserCategoryRepository extends JpaRepository<UserCategory, Long> {

    @Query(value = "SELECT c FROM UserCategory c where c.name=0 ")
    UserCategory getRegularCategory();

    @Query(value = "SELECT c FROM UserCategory c where c.name=1 ")
    UserCategory getBronzeCategory();

    @Query(value = "SELECT c FROM UserCategory c where c.name=2 ")
    UserCategory getSilverCategory();

    @Query(value = "SELECT c FROM UserCategory c where c.name=3 ")
    UserCategory getGoldCategory();
}
