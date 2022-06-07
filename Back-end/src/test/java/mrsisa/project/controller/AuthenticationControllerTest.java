package mrsisa.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import mrsisa.project.dto.JwtAuthenticationRequest;
import mrsisa.project.util.TestUtil;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.security.Principal;

import static mrsisa.project.util.TestUtil.json;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AuthenticationControllerTest {
    private static final String URL_PREFIX = "/api/auth";

    private MediaType contentType = new MediaType(MediaType.APPLICATION_JSON.getType(), MediaType.APPLICATION_JSON.getSubtype());

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private JwtAuthenticationRequest jwtAuthenticationRequest;



    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        jwtAuthenticationRequest = new JwtAuthenticationRequest();
        jwtAuthenticationRequest.setPassword("ici");
        jwtAuthenticationRequest.setUsername("ici");
    }

    @Test
    public void testLogin() throws Exception {
        mockMvc.perform(post(URL_PREFIX + "/login").contentType(MediaType.APPLICATION_JSON).content(TestUtil.json(jwtAuthenticationRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(jsonPath("$.accessToken").value(is(notNullValue())));
    }
}
