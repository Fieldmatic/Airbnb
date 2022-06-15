package mrsisa.project.repository;

import mrsisa.project.model.Client;
import mrsisa.project.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ClientRepository extends JpaRepository<Client, Long> {
    public Client getByEmail(String email);

    @Query(value = "SELECT c FROM Client c JOIN FETCH c.reservations where c.username=?1")
    Client findByUsername(String username);

    @Query(value = "SELECT c FROM Client c JOIN FETCH c.subscriptions where c.username=?1")
    Client findClientByUsernameWithSubscriptions(String username);
}
