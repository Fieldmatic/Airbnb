package mrsisa.project.service;


import mrsisa.project.dto.InstructorDTO;
import mrsisa.project.dto.PersonDTO;
import mrsisa.project.model.Address;
import mrsisa.project.model.CottageOwner;
import mrsisa.project.model.Instructor;
import mrsisa.project.repository.AddressRepository;
import mrsisa.project.repository.InstructorRepository;
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
import static org.mockito.Mockito.verifyNoMoreInteractions;

@RunWith(SpringRunner.class)
@SpringBootTest
public class InstructorServiceTest {

    @Mock
    private InstructorRepository instructorRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private RoleService roleService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AdminService adminService;

    @Mock
    private UserCategoryService userCategoryService;

    @Mock
    private UserService userService;

    @Mock
    private PictureService pictureService;

    @InjectMocks
    private InstructorService instructorService;

    @Test
    @Transactional
    @Rollback(true)
    public void addTest() throws IOException {
        InstructorDTO instructorDTO = new InstructorDTO();
        instructorDTO.setUsername("instruktor");
        instructorDTO.setPassword("bane");
        instructorDTO.setName("Bane");
        instructorDTO.setSurname("Geric");
        instructorDTO.setEmail("bane.geric00@gmail.com");
        instructorDTO.setPhoneNumber("0628404086");
        Address address = new Address();
        address.setCity("Novi Sad");
        address.setState("Srbija");
        address.setZipCode("21000");
        address.setStreet("Arse Teodorovica 2");
        instructorDTO.setAddress(address);
        instructorDTO.setRegistrationExplanation("Zelim da se registrujem na vas sajt");
        instructorDTO.setRole("ROLE_INSTRUCTOR");

        int instructorCountBeforeAdd = instructorService.findAll().size();
        Instructor instructor = (Instructor) instructorService.add(instructorDTO, java.util.Optional.empty());

        when(instructorRepository.findByUsername("instruktor")).thenReturn(instructor);
        when(instructorRepository.findAll()).thenReturn(Arrays.asList(instructor));

        assertThat(instructorService.findInstructorByUsername("instruktor")).isNotNull();

        List<Instructor> instructors = instructorService.findAll();
        assertThat(instructors).hasSize(instructorCountBeforeAdd + 1);

        verify(instructorRepository, times(2)).findAll();
        verify(instructorRepository, times(2)).save(instructor);
        verify(instructorRepository, times(1)).findByUsername("instruktor");
        verifyNoMoreInteractions(instructorRepository);
    }
}