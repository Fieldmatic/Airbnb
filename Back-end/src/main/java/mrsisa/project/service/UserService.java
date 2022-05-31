package mrsisa.project.service;


import mrsisa.project.dto.PersonDTO;
import mrsisa.project.dto.PasswordChangeDTO;
import mrsisa.project.model.Person;
import mrsisa.project.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    PersonRepository personRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return personRepository.findByUsername(username);
    }

    public boolean emailTaken(String email) {
        return personRepository.findByEmail(email) != null;
    }

    public boolean usernameAvailable(String username){
        Person person = personRepository.findByUsername(username);
        return person == null;
    }

    public Person getByUsername(String username) {
        return personRepository.findByUsername(username);
    }

    public boolean updateUser(PersonDTO userDetails, Principal userP) {
        Person user = getByUsername(userP.getName());
        user.setUsername(userDetails.getUsername());
        user.setPassword(userDetails.getPassword());
        user.setName(userDetails.getName());
        user.setSurname(userDetails.getSurname());
        user.setAddress(userDetails.getAddress());
        user.setEmail(userDetails.getEmail());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.getAddress().setStreet(userDetails.getAddress().getStreet());
        user.getAddress().setCity(userDetails.getAddress().getCity());
        user.getAddress().setState(userDetails.getAddress().getState());
        personRepository.save(user);
        return true;
    }

    public String updatePassword(Principal userP, PasswordChangeDTO passwordChangeDTO){
        Person user = getByUsername(userP.getName());
        if (!passwordEncoder.matches(passwordChangeDTO.getOldPassword(), user.getPassword())) return "Wrong current password!";
        if (passwordEncoder.matches(passwordChangeDTO.getNewPassword(), user.getPassword())) return "You tried to set same password!";
        else user.setPassword(passwordEncoder.encode(passwordChangeDTO.getNewPassword()));
        personRepository.save(user);
        return "Success";
    }


}
