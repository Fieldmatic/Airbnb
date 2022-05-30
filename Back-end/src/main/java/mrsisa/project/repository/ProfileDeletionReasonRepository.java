package mrsisa.project.repository;

import mrsisa.project.model.Person;
import mrsisa.project.model.ProfileDeletionReason;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileDeletionReasonRepository extends JpaRepository<ProfileDeletionReason, Long> {
    public ProfileDeletionReason findProfileDeletionReasonByUser(Person user);
}
