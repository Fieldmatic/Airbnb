package mrsisa.project.controller;


import mrsisa.project.dto.ClientDTO;
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

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ClientControllerTest {
    private static final String URL_PREFIX = "/api/clients";

    private MediaType contentType = new MediaType(MediaType.APPLICATION_JSON.getType(), MediaType.APPLICATION_JSON.getSubtype());

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private Principal principal;

    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        principal = () -> "ivanica";
    }

    @Test
    @Transactional
    @Rollback(true)
    public void testUpdate() throws Exception {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setUsername("ivanica");
        //password
        clientDTO.setPassword("ivana");
        clientDTO.setName("Ivana");
        clientDTO.setSurname("Milic");
        clientDTO.setEmail("istevanovic3112@gmail.com");
        clientDTO.setProfilePhoto(null);
        clientDTO.setPhoneNumber("+38765656426");
        clientDTO.setId(3L);

        Address address = new Address();
        address.setId(4L);
        address.setZipCode("21000");
        address.setStreet("Dr Ivana Ribara 2");
        address.setState("Serbis");
        address.setCity("Novi Sad");
        clientDTO.setAddress(address);


        String json = TestUtil.json(clientDTO);
        this.mockMvc.perform(put(URL_PREFIX + "/update").contentType(contentType).content(json)).andExpect(status().isOk());
    }


    @Test
    @WithMockUser(username = "ivanica",roles = {"CLIENT"})
    public void testDeleteSubscription() throws Exception {
        this.mockMvc.perform(delete(URL_PREFIX + "/deleteSub/4").principal(principal)).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "ivanica",roles = {"CLIENT"})
    public void testGetClientCottageSubscriptions() throws Exception {
        mockMvc.perform(get(URL_PREFIX + "/getClientCottageSubscriptions").principal(principal)).andExpect(status().isOk())
                .andExpect(content().contentType(contentType)).andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$.[*].id").value(hasItem(5)))
                .andExpect(jsonPath("$.[*].name").value(hasItem("Suncana obala")));

    }

}
