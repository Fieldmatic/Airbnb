package mrsisa.project.service;

import mrsisa.project.model.Role;
import mrsisa.project.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public List<Role> findByName(String name) {
        return this.roleRepository.findByName(name);
    }
}
