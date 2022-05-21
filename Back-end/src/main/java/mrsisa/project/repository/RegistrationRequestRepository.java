package mrsisa.project.repository;

import mrsisa.project.model.RegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRequestRepository extends JpaRepository<RegistrationRequest, Long> {
}
