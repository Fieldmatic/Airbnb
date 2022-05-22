package mrsisa.project.repository;

import mrsisa.project.model.Action;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ActionRepository extends JpaRepository<Action, Long> {
    @Query(value = "SELECT * FROM action a left join bookable_actions ba on a.id = ba.actions_id where ba.bookable_id = ?1 and a.used is false and a.expiration_date > CURRENT_TIMESTAMP", nativeQuery = true)
    List<Action> findActions(Long id);
}