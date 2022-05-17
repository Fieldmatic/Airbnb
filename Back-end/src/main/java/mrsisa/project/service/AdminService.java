package mrsisa.project.service;

import mrsisa.project.dto.ProfileDeletionReasonDTO;
import mrsisa.project.model.Instructor;
import mrsisa.project.model.ProfileDeletionReason;
import mrsisa.project.repository.AdminRepository;
import mrsisa.project.repository.InstructorRepository;
import mrsisa.project.repository.PersonRepository;
import mrsisa.project.repository.ProfileDeletionReasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    PersonRepository personRepository;

    @Autowired
    ProfileDeletionReasonRepository profileDeletionReasonRepository;

    public boolean sendRequestForProfileDeletion(Long id, ProfileDeletionReasonDTO pdrDTO) {
        Instructor instructor = (Instructor) personRepository.findById(id).orElse(null);
        if (instructor == null) return false;
        if (!instructor.getPassword().equals(pdrDTO.getPassword())) return false;
        ProfileDeletionReason profileDeletionReason = this.dtoToPDR(pdrDTO, instructor);
        profileDeletionReasonRepository.save(profileDeletionReason);
        return true;
    }

    private ProfileDeletionReason dtoToPDR(ProfileDeletionReasonDTO pdrDTO, Instructor instructor) {
        ProfileDeletionReason profileDeletionReason = new ProfileDeletionReason();
        profileDeletionReason.setReason(pdrDTO.getReason());
        profileDeletionReason.setUser(instructor);
        return profileDeletionReason;
    }
}
