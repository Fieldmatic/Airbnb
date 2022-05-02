package mrsisa.project.repository;

import mrsisa.project.model.Adventure;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AddressRepository extends JpaRepository<Adventure, Long> {

}
