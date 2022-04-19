package mrsisa.project.service;

import mrsisa.project.model.Address;
import mrsisa.project.model.ProfileDeletionReason;
import mrsisa.project.repository.ProfileDeletionReasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileDeletionReasonService {
    @Autowired
    private ProfileDeletionReasonRepository profileDeletionReasonRepository;

    public ProfileDeletionReason save(ProfileDeletionReason reason) {return profileDeletionReasonRepository.save(reason);}
}
