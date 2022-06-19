package mrsisa.project.service;

import mrsisa.project.dto.PersonDTO;
import mrsisa.project.model.Address;
import mrsisa.project.model.CottageOwner;
import mrsisa.project.model.Person;
import mrsisa.project.model.Role;
import mrsisa.project.repository.AddressRepository;
import mrsisa.project.repository.CottageOwnerRepository;
import mrsisa.project.repository.RoleRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CottageOwnerServiceTest {
    @Mock
    private CottageOwnerRepository cottageOwnerRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private RoleService roleService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AdminService adminService;

    @InjectMocks
    private CottageOwnerService cottageOwnerService;


    @Test
    @Transactional
    @Rollback(true)
    public void contextLoads() throws IOException {
        PersonDTO owner = new PersonDTO();
        owner.setUsername("vlasnik");
        owner.setPassword("vlasnik");
        owner.setName("Mico");
        owner.setSurname("Milic");
        owner.setEmail("milic@gmail.com");
        owner.setProfilePhoto(null);
        owner.setPhoneNumber("06666666");
        Address address = new Address();
        address.setCity("Grad");
        address.setState("Srbija");
        address.setZipCode("21000");
        owner.setAddress(address);
        owner.setRegistrationExplanation("Registrujem se");
        owner.setRole("ROLE_COTTAGE_OWNER");
        int ownersSizeBeforeAdd = cottageOwnerService.findAll().size();
        CottageOwner cottageOwner = (CottageOwner) cottageOwnerService.add(owner, java.util.Optional.empty());

        when(cottageOwnerRepository.findByUsername("vlasnik")).thenReturn(cottageOwner);
        when(cottageOwnerRepository.findAll()).thenReturn(Arrays.asList(cottageOwner));

        assertThat(cottageOwnerService.findCottageOwnerByUsername("vlasnik")).isNotNull();

        List<CottageOwner> owners = cottageOwnerService.findAll();
        assertThat(owners).hasSize(ownersSizeBeforeAdd + 1);

        verify(cottageOwnerRepository,times(2)).findAll();
        verify(cottageOwnerRepository,times(2)).save(cottageOwner);
        verify(cottageOwnerRepository,times(1)).findByUsername("vlasnik");
        verifyNoMoreInteractions(cottageOwnerRepository);

    }
}
