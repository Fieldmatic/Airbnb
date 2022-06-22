package mrsisa.project.controller;


import mrsisa.project.dto.PersonDTO;
import mrsisa.project.model.Address;
import mrsisa.project.util.TestUtil;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.security.Principal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@RunWith(SpringRunner.class)
@SpringBootTest
public class UserControllerTest {

    private static final String URL_PREFIX = "/api/user";

    private MediaType contentType = new MediaType(MediaType.APPLICATION_JSON.getType(), MediaType.APPLICATION_JSON.getSubtype());

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private Principal principal;

    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        principal = () -> "banzg";
    }

    @Test
    @Transactional
    @Rollback(true)
    @WithMockUser(username = "banzg", roles = {"INSTRUCTOR"})
    public void testUpdate() throws Exception {
        PersonDTO personDTO = new PersonDTO();
        personDTO.setUsername("banzg");
        //password
        personDTO.setPassword("ivana");
        personDTO.setName("Baneeeee");
        personDTO.setSurname("Geraa");
        personDTO.setEmail("bane.geric00@gmail.com");
        personDTO.setProfilePhoto(null);
        personDTO.setPhoneNumber("+38765656426");

        Address address = new Address();
        address.setId(99L);
        address.setZipCode("21000");
        address.setStreet("Arse Teodorovica 2");
        address.setState("Serbia");
        address.setCity("Novi Sad");
        personDTO.setAddress(address);


        String json = TestUtil.json(personDTO);
        this.mockMvc.perform(put(URL_PREFIX + "/update").principal(principal)
                .contentType(contentType).content(json)).andExpect(status().isOk());
    }

}
