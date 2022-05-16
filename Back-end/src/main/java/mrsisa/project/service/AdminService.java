package mrsisa.project.service;

import mrsisa.project.dto.ProfileDeletionReasonDTO;
import mrsisa.project.model.Instructor;
import mrsisa.project.repository.AdminRepository;
import mrsisa.project.repository.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    InstructorRepository instructorRepository;

    public boolean deleteInstructor(Long id, ProfileDeletionReasonDTO pdrDTO) {
        Instructor instructor = instructorRepository.findById(id).orElse(null);
        if (instructor == null) return false;
        if (!instructor.getPassword().equals(pdrDTO.getPassword())) return false;
        // TODO: adminu se prikaze zahtjev za brisanjem pa ga on potrvdi ili odbije
        instructor.setActive(false);
        instructorRepository.save(instructor);
        return true;
    }
}
