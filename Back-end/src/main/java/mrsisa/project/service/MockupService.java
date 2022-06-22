package mrsisa.project.service;

import mrsisa.project.dto.*;
import mrsisa.project.model.*;
import mrsisa.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class MockupService {
    @Autowired
    private ClientService clientService;

    @Autowired
    private CottageOwnerService cottageOwnerService;

    @Autowired
    private CottageRepository cottageRepository;

    @Autowired
    private BoatRepository boatRepository;

    @Autowired
    private CottageOwnerRepository cottageOwnerRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private PeriodService periodService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private AdventureRepository adventureRepository;

    @Autowired
    private BoatOwnerService boatOwnerService;


    public Client createClient1() throws IOException {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setUsername("ivanica");
        clientDTO.setPassword("ivana");
        clientDTO.setName("Ivana");
        clientDTO.setSurname("Stevanovic");
        clientDTO.setEmail("istevanovic3112@gmail.com");
        clientDTO.setProfilePhoto("src/main/resources/static/pictures/client/4/ivanaProfilePicture.jpg");
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
        cottage.setProfilePicture("src/main/resources/static/pictures/cottage/5/torknik.png");
        cottage.setPictures(new ArrayList<String>(Arrays.asList("src/main/resources/static/pictures/cottage/5/torknik.png","src/main/resources/static/pictures/cottage/5/tornik2.png","src/main/resources/static/pictures/cottage/5/tornik3.png","src/main/resources/static/pictures/cottage/5/tornik4.png")));
        cottage.setRules("Nema");
        cottage.setRating(4.8);
        cottage.setCapacity(3);
        cottage.setSubscribedClients(new ArrayList<>());

        cottageRepository.save(cottage);
        List<Tag> additionalServices = new ArrayList<>();
        Tag tag1 = new Tag("wifi", cottage);
        Tag tag2 = new Tag("mini bar", cottage);
        Tag tag3 = new Tag("jacuzzi", cottage);
        Tag tag4 = new Tag("tv", cottage);
        Tag tag5 = new Tag("pool", cottage);
        tagRepository.save(tag1);
        tagRepository.save(tag2);
        tagRepository.save(tag3);
        tagRepository.save(tag4);
        tagRepository.save(tag5);
        additionalServices.add(tag1);
        additionalServices.add(tag2);
        additionalServices.add(tag3);
        additionalServices.add(tag4);
        additionalServices.add(tag5);

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

    public Boat createBoat1() {
        Address address = new Address();
        address.setZipCode("2000");
        address.setStreet("Alekse Santica 27");
        address.setState("Serbia");
        address.setCity("Beograd");

        Boat boat = new Boat();
        boat.setName("Uljezova ladja");
        boat.setAddress(address);
        boat.setPromotionalDescription("Opis je ovaj");
        boat.setProfilePicture("src/main/resources/static/pictures/cottage/5/drinskaRuza.jpg");
        boat.setRules("Nema");
        boat.setRating(2.3);
        boat.setCapacity(10);
        boat.setType(BoatType.CRUISER);
        boat.setEnginesNumber(5);
        boat.setEnginePower(500.0);
        boat.setLength(15);
        boat.setMaxSpeed(90.0);
        List<String> navigationEquipment = new ArrayList<>();
        navigationEquipment.add("brod");
        navigationEquipment.add("camac");
        boat.setNavigationEquipment(navigationEquipment);

        List<String> fishingEquipment = new ArrayList<>();
        fishingEquipment.add("pecanje");
        fishingEquipment.add("oprema");
        boat.setFishingEquipment(fishingEquipment);

        boat.setSubscribedClients(new ArrayList<>());

        boatRepository.save(boat);
        List<Tag> additionalServices = new ArrayList<>();
        Tag tag2 = new Tag("jetski", boat);
        Tag tag3 = new Tag("cocktails", boat);
        tagRepository.save(tag2);
        tagRepository.save(tag3);
        additionalServices.add(tag2);
        additionalServices.add(tag3);

        PriceList priceList = new PriceList();
        priceList.setHourlyRate(4200.00);
        priceList.setDailyRate(5500.00);
        priceList.setCancellationConditions("Nema uslova");

        priceList.setBookable(boat);

        boat.setPriceList(priceList);
        boat.setAdditionalServices(additionalServices);

        boatRepository.save(boat);
        return boat;
    }

    public Adventure createAdventure1() {
        Address address = new Address();
        address.setZipCode("2000");
        address.setStreet("Alekse Santica 27");
        address.setState("Serbia");
        address.setCity("Beograd");

        Adventure adventure = new Adventure();
        adventure.setName("Pecanje sa miletom");
        adventure.setAddress(address);
        adventure.setPromotionalDescription("Opis je ovaj");
        adventure.setProfilePicture(null);
        adventure.setRules("Nema");
        adventure.setRating(2.3);
        adventure.setCapacity(10);

        List<String> fishingEquipment = new ArrayList<>();
        fishingEquipment.add("pecanje");
        fishingEquipment.add("oprema");
        adventure.setFishingEquipment(fishingEquipment);

        adventure.setSubscribedClients(new ArrayList<>());

        adventureRepository.save(adventure);
        List<Tag> additionalServices = new ArrayList<>();
        Tag tag2 = new Tag("professional fishing rod", adventure);
        Tag tag3 = new Tag("hooks", adventure);
        tagRepository.save(tag2);
        tagRepository.save(tag3);
        additionalServices.add(tag2);
        additionalServices.add(tag3);

        PriceList priceList = new PriceList();
        priceList.setHourlyRate(2000.00);
        priceList.setCancellationConditions("Nema uslova");

        priceList.setBookable(adventure);

        adventure.setPriceList(priceList);
        adventure.setAdditionalServices(additionalServices);

        adventureRepository.save(adventure);
        return adventure;
    }

    public void subscribeClientOnCottage(Client client, Cottage cottage) {
        clientService.addSubscription(client, cottage.getId());
    }

    public CottageOwner createCottageOwner1() throws IOException {
        PersonDTO owner = new PersonDTO();
        owner.setUsername("m");
        owner.setPassword("m");
        owner.setName("Mico");
        owner.setSurname("Milic");
        owner.setEmail("milic@gmail.com");
        owner.setProfilePhoto(null);
        owner.setPhoneNumber("066684054");
        Address address = new Address();
        address.setCity("Grad");
        address.setState("Srbija");
        address.setZipCode("21000");
        owner.setAddress(address);
        owner.setRegistrationExplanation("Registrujem se");
        owner.setRole("ROLE_COTTAGE_OWNER");
        CottageOwner cottageOwner = (CottageOwner) cottageOwnerService.add(owner, Optional.empty());

        return cottageOwner;
    }

    //public BoatOwner creatBoatOwner1() throws IOException {
        /*PersonDTO owner = new PersonDTO();
        owner.setUsername("b");
        owner.setPassword("b");
        owner.setName("Mico");
        owner.setSurname("Milic");
        owner.setEmail("milicboat@gmail.com");
        owner.setProfilePhoto(null);
        owner.setPhoneNumber("066684054");
        Address address = new Address();
        address.setCity("Grad");
        address.setState("Srbija");
        address.setZipCode("21000");
        owner.setAddress(address);
        owner.setRegistrationExplanation("Registrujem se");
        owner.setRole("ROLE_COTTAGE_OWNER");
        MultiValueMap<String, Object> body
                = new LinkedMultiValueMap<>();
        body.add("files", getTestFile());
        body.add("files", getTestFile());
        body.add("files", getTestFile());

        BoatOwner boatOwner = (BoatOwner) boatOwnerService.add(owner, Optional.empty());*/

        //return boatOwner;
    //}

    @Transactional
    public void addOwnerToCottage(String cottageOwnerUsername, Long cottageId) {
        CottageOwner owner = cottageOwnerRepository.findByUsername(cottageOwnerUsername);
        Cottage cottage = cottageRepository.getById(cottageId);
        cottage.setCottageOwner(owner);
        cottageRepository.save(cottage);

        owner.getCottages().add(cottage);
        cottageOwnerRepository.save(owner);

    }

    public void addPeriodToBookable(Long bookableId) {
        PeriodDTO periodDto = new PeriodDTO();
        periodDto.setBookableId(bookableId);
        periodDto.setStartDateTime(LocalDateTime.now().plusDays(3) + "Z");
        periodDto.setEndDateTime(LocalDateTime.now().plusDays(35) + "Z");
        periodService.add(periodDto);
    }

    @Transactional
    public void addReservation1ToClient(Long clientId, Long cottageId) throws IOException {
        Cottage cottage = cottageRepository.getById(cottageId);
        ReservationDTO reservationDTO = new ReservationDTO();
        reservationDTO.setStartDateTime("2022-07-01T02:00:00Z");
        reservationDTO.setEndDateTime("2022-07-04T02:00:00Z");
        reservationDTO.setPersonLimit(1);
        reservationDTO.setPrice(1300.0);
        reservationDTO.setBookableId(cottageId);
        reservationDTO.setActive(false);

        List<Tag> services = cottage.getAdditionalServices();
        reservationDTO.setAdditionalServices(reservationDTO.getStringAdditionalServices(services));
        reservationService.add(reservationDTO, clientService.findClientByUsername("ivanica"));
    }

    @Transactional
    public void addReservation2ToClient(Long clientId, Long cottageId) throws IOException {
        Cottage cottage = cottageRepository.getById(cottageId);
        ReservationDTO reservationDTO = new ReservationDTO();
        reservationDTO.setStartDateTime("2022-07-05T02:00:00Z");
        reservationDTO.setEndDateTime("2022-07-08T02:00:00Z");
        reservationDTO.setPersonLimit(1);
        reservationDTO.setPrice(3000.0);
        reservationDTO.setBookableId(cottageId);
        reservationDTO.setActive(false);

        List<Tag> services = cottage.getAdditionalServices();
        reservationDTO.setAdditionalServices(reservationDTO.getStringAdditionalServices(services));
        reservationService.add(reservationDTO, clientService.findClientByUsername("ivanica"));
    }

    @Transactional
    public void createReview1ForReservation(Long clientId, Long bookableId, Long ownerId) {
        Client client = clientService.findClientById(clientId);
        List<ReservationDTO> clientReservations = reservationService.getClientReservations(client);
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setReservationId(clientReservations.get(0).getId());
        reviewDTO.setBookableRating(4);
        reviewDTO.setBookableComment("top");
        reviewDTO.setOwnerRating(5);
        reviewDTO.setOwnerComment("vrh");
        reviewDTO.setBookableId(bookableId);
        reviewDTO.setOwnerId(ownerId);
        reviewService.add(reviewDTO);
    }

    @Transactional
    public void createReview2ForReservation(Long clientId, Long bookableId, Long ownerId) {
        Client client = clientService.findClientById(clientId);
        List<ReservationDTO> clientReservations = reservationService.getClientReservations(client);
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setReservationId(clientReservations.get(1).getId());
        reviewDTO.setBookableRating(2);
        reviewDTO.setBookableComment("lose");
        reviewDTO.setOwnerRating(3);
        reviewDTO.setOwnerComment("lose malo");
        reviewDTO.setBookableId(bookableId);
        reviewDTO.setOwnerId(ownerId);
        reviewService.add(reviewDTO);
    }

}
