package mrsisa.project.repository;

import mrsisa.project.model.RegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;

public interface RegistrationRequestRepository extends JpaRepository<RegistrationRequest, Long> {
    @Query(value = "SELECT r FROM RegistrationRequest r JOIN FETCH r.user")
    ArrayList<RegistrationRequest> findAll();

}
