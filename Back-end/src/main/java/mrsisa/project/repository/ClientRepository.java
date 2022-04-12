package mrsisa.project.repository;

import mrsisa.project.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
    //mozda ti ovo Long bude greska
    //all crud database methods
}
