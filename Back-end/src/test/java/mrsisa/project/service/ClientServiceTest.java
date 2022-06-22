package mrsisa.project.service;

import mrsisa.project.dto.ClientDTO;
import mrsisa.project.model.Address;
import mrsisa.project.model.Client;
import mrsisa.project.model.Cottage;
import mrsisa.project.repository.BookableRepository;
import mrsisa.project.repository.ClientRepository;
import mrsisa.project.repository.PersonRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ClientServiceTest {

    @Mock
    private ClientRepository clientRepositoryMock;

    @Mock
    private PersonRepository personRepository;

    @Mock
    private BookableRepository bookableRepository;

    @Mock
    private RoleService roleService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PictureService pictureService;

    @Mock
    private UserCategoryService userCategoryService;

    @InjectMocks
    private ClientService clientService;

    @Test
    public void testAdd() throws IOException {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setUsername("client");
        clientDTO.setPassword("client");
        clientDTO.setName("Ivana");
        clientDTO.setSurname("Stevanovic");
        clientDTO.setEmail("istevanovic@gmail.com");
        clientDTO.setProfilePhoto(null);
        clientDTO.setPhoneNumber("065656426");
        Address address = new Address();
        address.setCity("Novi Sad");
        address.setState("Srbija");
        address.setZipCode("21000");
        clientDTO.setAddress(address);

        int clientDbSizeBeforeAdd = clientService.findAll().size();
        Client client = clientService.add(clientDTO, java.util.Optional.empty());

        // 1. Definisanje ponašanja mock objekata
        when(clientRepositoryMock.findAll()).thenReturn(Arrays.asList(client));
        when(clientRepositoryMock.findByUsername("client")).thenReturn(client);

        //2. Akcija
        assertThat(client).isNotNull();
        List<Client> clients = clientService.findAll();
        assertThat(clients).hasSize(clientDbSizeBeforeAdd + 1); //verifikacija da je novi student upisan u bazu

        Client lastClient = clients.get(clients.size() - 1); // preuzimanje poslednjeg studenta

        assertThat(lastClient.getName()).isEqualToIgnoringCase(client.getName());
        assertThat(lastClient.getEmail()).isEqualTo(client.getEmail());
        assertThat(lastClient.getUsername()).isEqualTo(client.getUsername());

        verify(clientRepositoryMock, times(2)).findAll();
        verify(clientRepositoryMock, times(2)).save(client);
        verifyNoMoreInteractions(clientRepositoryMock);

    }


    @Test
    public void testCheckIfClientIsSubscribed() {
        Client client = new Client();
        client.setUsername("client");
        client.setPassword("client");
        client.setName("Ivana");
        client.setSurname("Stevanovic");
        client.setEmail("istevanovic@gmail.com");
        client.setProfilePhoto(null);
        client.setPhoneNumber("065656426");
        Address address = new Address();
        address.setCity("Novi Sad");
        address.setState("Srbija");
        address.setZipCode("21000");
        client.setAddress(address);

        Cottage cottage = new Cottage();
        cottage.setId(8L);
        cottage.setName("Vikendan");
        cottage.setAddress(address);
        cottage.setPromotionalDescription("Najlepse je kod nas");
        cottage.setPictures(null);
        cottage.setProfilePicture(null);
        cottage.setPriceList(null);
        cottage.setRules("Nema pravila");
        cottage.setSubscribedClients(new ArrayList<>());
        client.setSubscriptions(new ArrayList<>());

        boolean subscribed = clientService.checkIfClientIsSubscribed(client, cottage.getId());

        //2. Akcija
        assertThat(client).isNotNull();
        assertThat(subscribed).isFalse();

        client.getSubscriptions().add(cottage);
        cottage.getSubscribedClients().add(client);

        subscribed = clientService.checkIfClientIsSubscribed(client, cottage.getId());
        assertThat(subscribed).isTrue();


        client.getSubscriptions().remove(cottage);
        cottage.getSubscribedClients().remove(client);

        subscribed = clientService.checkIfClientIsSubscribed(client, cottage.getId());
        assertThat(subscribed).isFalse();

        verifyNoMoreInteractions(clientRepositoryMock);

    }


}
