package mrsisa.project.repository;

import mrsisa.project.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Long> {

    Person findByUsername(String username);
    Person findByEmail(String email);
}
