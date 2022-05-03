package mrsisa.project.service;

import mrsisa.project.model.Person;
import mrsisa.project.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ValidationService {
    @Autowired
    PersonRepository personRepository;

    public boolean usernameAvailable(String username){
        Person person = personRepository.findByUsername(username);
        return person == null;
    }
}
