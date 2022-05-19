package mrsisa.project.service;


import mrsisa.project.model.Person;
import mrsisa.project.repository.PersonRepository;
import mrsisa.project.security.auth.TokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    PersonRepository personRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return personRepository.findByUsername(username);
    }

    public boolean usernameAvailable(String username){
        Person person = personRepository.findByUsername(username);
        return person == null;
    }

}
