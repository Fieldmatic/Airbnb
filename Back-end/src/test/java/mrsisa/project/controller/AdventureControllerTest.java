package mrsisa.project.controller;


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
public class AdventureControllerTest {

    private static final String URL_PREFIX = "/api/adventure";

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
    public void testGetAllAdventures() throws Exception {
        mockMvc.perform(get(URL_PREFIX + "/all")).andExpect(status().isOk())
                .andExpect(jsonPath("$.[*].id").value(hasItem(199)))
                .andExpect(jsonPath("$.[*].name").value(hasItem("Avanturica")))
                .andExpect(jsonPath("$.[*].hourlyRate").value(hasItem(300.0)));

    }


    @Test
    @Transactional
    @Rollback(true)
    @WithMockUser(username = "banzg",roles = {"INSTRUCTOR"})
    public void testDeleteAdventure() throws Exception {
        mockMvc.perform(delete(URL_PREFIX + "/deleteAdventure/" + 199).principal(principal)).andExpect(status().isOk());
    }
}
