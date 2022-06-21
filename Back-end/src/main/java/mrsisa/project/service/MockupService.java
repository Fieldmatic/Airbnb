package mrsisa.project.service;

import mrsisa.project.dto.ClientDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.CottageRepository;
import mrsisa.project.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class MockupService {
    @Autowired
    private ClientService clientService;

    @Autowired
    private CottageRepository cottageRepository;

    @Autowired
    private TagRepository tagRepository;


    public Client createClient1() throws IOException {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setUsername("ivanica");
        clientDTO.setPassword("ivana");
        clientDTO.setName("Ivana");
        clientDTO.setSurname("Stevanovic");
        clientDTO.setEmail("istevanovic3112@gmail.com");
        clientDTO.setProfilePhoto("src/main/resources/static/pictures/client/3/clientProfilePicture.jpg");
        clientDTO.setPhoneNumber("+38765656426");

        Address address = new Address();
        address.setZipCode("21000");
        address.setStreet("Dr Ivana Ribara 2");
        address.setState("Serbia");
        address.setCity("Belgrade");
        clientDTO.setAddress(address);

        return clientService.add(clientDTO, java.util.Optional.empty());
    }

    public Cottage createCottage1() {
        Address address = new Address();
        address.setZipCode("36000");
        address.setStreet("Nikole Tesle 5");
        address.setState("BiH");
        address.setCity("Bijeljina");

        Cottage cottage = new Cottage();
        cottage.setName("Suncana obala");
        cottage.setAddress(address);
        cottage.setPromotionalDescription("Nema");
        cottage.setProfilePicture(null);
        cottage.setRules("Nema");
        cottage.setRating(8.3);
        cottage.setCapacity(3);
        cottage.setSubscribedClients(new ArrayList<>());

        cottageRepository.save(cottage);
        List<Tag> additionalServices = new ArrayList<>();
        Tag tag1 = new Tag("wiFi", cottage);
        tagRepository.save(tag1);
        additionalServices.add(tag1);

        PriceList priceList = new PriceList();
        priceList.setHourlyRate(1400.00);
        priceList.setDailyRate(3000.00);
        priceList.setCancellationConditions("Nema uslova");

        priceList.setBookable(cottage);

        cottage.setPriceList(priceList);
        cottage.setAdditionalServices(additionalServices);

        cottageRepository.save(cottage);
        return cottage;
    }

    public void subscribeClientOnCottage(Client client, Cottage cottage) {
        clientService.addSubscription(client, cottage.getId());
    }
}
