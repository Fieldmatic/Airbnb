package mrsisa.project.repository;

import mrsisa.project.model.ClientCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientCategoryRepository extends JpaRepository<ClientCategory, Long> {
}
