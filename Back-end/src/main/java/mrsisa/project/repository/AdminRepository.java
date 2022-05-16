package mrsisa.project.repository;

import mrsisa.project.model.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Administrator, Long> {
}
