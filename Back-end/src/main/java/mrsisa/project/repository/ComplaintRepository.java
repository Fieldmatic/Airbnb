package mrsisa.project.repository;

import mrsisa.project.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findComplaintByReservation_Id(Long id);

}
