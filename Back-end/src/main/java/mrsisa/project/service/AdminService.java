package mrsisa.project.service;

import mrsisa.project.dto.ProfileDeletionReasonDTO;
import mrsisa.project.model.Instructor;
import mrsisa.project.model.Person;
import mrsisa.project.model.ProfileDeletionReason;
import mrsisa.project.repository.AdminRepository;
import mrsisa.project.repository.InstructorRepository;
import mrsisa.project.repository.PersonRepository;
import mrsisa.project.repository.ProfileDeletionReasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    PersonRepository personRepository;

    @Autowired
    ProfileDeletionReasonRepository profileDeletionReasonRepository;

    public boolean sendRequestForProfileDeletion(Long id, ProfileDeletionReasonDTO pdrDTO) {
        Person person = personRepository.findById(id).orElse(null);
        if (person == null) return false;
        if (!person.getPassword().equals(pdrDTO.getPassword())) return false;
        ProfileDeletionReason profileDeletionReason = this.dtoToPDR(pdrDTO, person);
        profileDeletionReasonRepository.save(profileDeletionReason);
        return true;
    }

    public List<ProfileDeletionReasonDTO> getProfileDeletionReasons() {
        List<ProfileDeletionReasonDTO> pdrDTOs = new ArrayList<>();
        for(ProfileDeletionReason pdr : profileDeletionReasonRepository.findAll()) {
            if (!pdr.getViewed())
                pdrDTOs.add(new ProfileDeletionReasonDTO(pdr));
        }
        return pdrDTOs;
    }

    public boolean deleteAccount(Long userId, Long profileDeletionId, boolean delete) {
        Person person = personRepository.findById(userId).orElse(null);
        ProfileDeletionReason pdr = profileDeletionReasonRepository.findById(profileDeletionId).orElse(null);
        if (person == null || pdr == null) return false;
        if (delete)
            person.setActive(false);
        pdr.setViewed(true);
        pdr.setApproved(delete);
        personRepository.save(person);
        profileDeletionReasonRepository.save(pdr);
        return true;
    }

    private ProfileDeletionReason dtoToPDR(ProfileDeletionReasonDTO pdrDTO, Person person) {
        ProfileDeletionReason profileDeletionReason = new ProfileDeletionReason();
        profileDeletionReason.setReason(pdrDTO.getReason());
        profileDeletionReason.setUser(person);
        profileDeletionReason.setViewed(false);
        return profileDeletionReason;
    }


}
