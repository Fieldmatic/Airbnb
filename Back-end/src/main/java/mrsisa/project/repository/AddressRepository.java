package mrsisa.project.repository;

import mrsisa.project.model.Address;
import mrsisa.project.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
