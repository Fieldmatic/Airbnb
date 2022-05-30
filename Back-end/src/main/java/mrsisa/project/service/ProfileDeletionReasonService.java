package mrsisa.project.service;

import mrsisa.project.model.Address;
import mrsisa.project.model.Person;
import mrsisa.project.model.ProfileDeletionReason;
import mrsisa.project.repository.ProfileDeletionReasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
public class ProfileDeletionReasonService {
    @Autowired
    private ProfileDeletionReasonRepository profileDeletionReasonRepository;

    @Autowired
    private UserService userService;

    public ProfileDeletionReason save(ProfileDeletionReason reason) {return profileDeletionReasonRepository.save(reason);}

    public Boolean createDeleteRequest(String reason, Principal userP){
        Person person = userService.getByUsername(userP.getName());
        if (profileDeletionReasonRepository.findProfileDeletionReasonByUser(person) != null) return false;
        ProfileDeletionReason deletionReason = new ProfileDeletionReason(reason.substring(0, reason.length() - 1).replace('+', ' '), false, person);
        profileDeletionReasonRepository.save(deletionReason);
        return true;
    }
}
