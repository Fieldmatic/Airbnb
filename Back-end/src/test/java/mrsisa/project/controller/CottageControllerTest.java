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

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.nio.charset.Charset;
import java.nio.file.attribute.UserPrincipal;
import java.security.Principal;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CottageControllerTest {

    private static final String URL_PREFIX = "/api/cottage";

    private MediaType contentType = new MediaType(MediaType.APPLICATION_JSON.getType(), MediaType.APPLICATION_JSON.getSubtype());

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private Principal principal;

    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        principal = () -> "ici";
    }

    @Test
    public void testGetAllCottages() throws Exception {
        mockMvc.perform(get(URL_PREFIX + "/all")).andExpect(status().isOk())
                .andExpect(content().contentType(contentType)).andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$.[*].id").value(hasItem(99)))
                .andExpect(jsonPath("$.[*].name").value(hasItem("Suncana reka")))
                .andExpect(jsonPath("$.[*].dailyRate").value(hasItem(1500.0)))
                .andExpect(jsonPath("$.[*].hourlyRate").value(hasItem(500.0)));

    }

    @Test
    @Transactional
    @Rollback(true)
    @WithMockUser(username = "ici",roles = {"COTTAGE_OWNER"})
    public void testDeleteCottage() throws Exception {
        mockMvc.perform(delete(URL_PREFIX + "/deleteCottage/" + 99).principal(principal)).andExpect(status().isOk());
    }
}
