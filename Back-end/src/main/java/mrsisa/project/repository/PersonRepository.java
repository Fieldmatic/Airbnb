package mrsisa.project.repository;

import mrsisa.project.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface PersonRepository extends JpaRepository<Person, Long> {

    Person findByUsername(String username);
    Person findByEmail(String email);
}
