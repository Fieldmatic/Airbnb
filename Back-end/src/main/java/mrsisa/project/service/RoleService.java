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

    public void createRoles() {
        Role role1 = new Role("ROLE_CLIENT");
        Role role2 = new Role("ROLE_ADMIN");
        Role role3 = new Role("ROLE_COTTAGE_OWNER");
        Role role4 = new Role("ROLE_BOAT_OWNER");
        Role role5 = new Role("ROLE_INSTRUCTOR");
        roleRepository.save(role1);
        roleRepository.save(role2);
        roleRepository.save(role3);
        roleRepository.save(role4);
        roleRepository.save(role5);
    }

    public void save(Role role) {
        roleRepository.save(role);
    }
}
