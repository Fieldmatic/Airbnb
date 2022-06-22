package mrsisa.project.service;


import mrsisa.project.dto.AdminDTO;
import mrsisa.project.model.Address;
import mrsisa.project.model.Administrator;
import mrsisa.project.repository.AddressRepository;
import mrsisa.project.repository.AdminRepository;
import mrsisa.project.repository.PersonRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;

import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AdminServiceTest {

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private RoleService roleService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PersonRepository personRepository;

    @Mock
    private AdminRepository adminRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    @Transactional
    @Rollback(true)
    public void addTest() {
        AdminDTO adminDTO = new AdminDTO();
        adminDTO.setUsername("testAdmin");
        adminDTO.setPassword("bane");
        adminDTO.setName("Bane");
        adminDTO.setSurname("Geric");
        adminDTO.setEmail("bane.geric00@gmail.com");
        adminDTO.setPhone("0628404086");
        Address address = new Address();
        address.setCity("Novi Sad");
        address.setState("Srbija");
        address.setZipCode("21000");
        address.setStreet("Arse Teodorovica 2");
        adminDTO.setAddress(address);

        int adminCountBeforeAdd = adminService.findAll().size();
        Administrator admin = adminService.add(adminDTO);

        when(personRepository.findByUsername("testAdmin")).thenReturn(admin);
        when(adminRepository.findAll()).thenReturn(Arrays.asList(admin));

        assertThat(adminService.findAdminByUsername("testAdmin")).isNotNull();

        List<Administrator> admins = adminService.findAll();
        assertThat(admins).hasSize(adminCountBeforeAdd + 1);

        verify(adminRepository, times(2)).findAll();
        verify(adminRepository, times(1)).save(admin);
        verify(personRepository, times(1)).findByUsername("testAdmin");
        verifyNoMoreInteractions(personRepository);
        verifyNoMoreInteractions(adminRepository);
    }
}
