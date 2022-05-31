package mrsisa.project.repository;

import mrsisa.project.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
    public Client getByEmail(String email);
}
