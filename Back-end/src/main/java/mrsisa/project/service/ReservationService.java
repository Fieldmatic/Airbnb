package mrsisa.project.service;

import mrsisa.project.dto.CottageDTO;
import mrsisa.project.dto.ReservationDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.ActionRepository;
import mrsisa.project.repository.ClientRepository;
import mrsisa.project.repository.PersonRepository;
import mrsisa.project.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    PersonRepository personRepository;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    ActionRepository actionRepository;


    @Transactional
    public void add(Long actionId, Principal userP) throws IOException {
        Action action = actionRepository.getById(actionId);
        Reservation reservation = createReservationFromAction(action);
        action.setUsed(true);
        actionRepository.save(action);
        Client client = (Client) personRepository.findByUsername(userP.getName());
        reservation.setClient(client);
        client.getReservations().add(reservation);
        clientRepository.save(client);
    }

    @Transactional
    public List<ReservationDTO> getReservations(Principal userP){
        Person person = personRepository.findByUsername(userP.getName());
        Role role = person.getRoles().get(0);
        switch (role.getName()){
            case "ROLE_COTTAGE_OWNER":return getCottageOwnerReservations(person);
            case "ROLE_BOAT_OWNER":return getBoatOwnerReservations(person);
            case "ROLE_INSTRUCTOR":return getInstructorReservations(person);
            default:return getClientReservations(person);
        }
    }

    public List<ReservationDTO> getCottageOwnerReservations(Person person){
        List<ReservationDTO> reservationsDTO = new ArrayList<>();
        CottageOwner owner = (CottageOwner) person;
        List<Cottage> cottages = owner.getCottages();
        for (Cottage cottage : cottages) {
            for (Reservation reservation : cottage.getReservations()) reservationsDTO.add(new ReservationDTO(reservation));
        }
        return reservationsDTO;
    }

    public List<ReservationDTO> getBoatOwnerReservations(Person person){
        List<ReservationDTO> reservationsDTO = new ArrayList<>();
        BoatOwner owner = (BoatOwner) person;
        List<Boat> boats = owner.getBoats();
        for (Boat boat : boats) {
            for (Reservation reservation : boat.getReservations()) reservationsDTO.add(new ReservationDTO(reservation));
        }
        return reservationsDTO;
    }

    public List<ReservationDTO> getInstructorReservations(Person person){
        List<ReservationDTO> reservationsDTO = new ArrayList<>();
        Instructor instructor = (Instructor) person;
        List<Adventure> adventures = instructor.getAdventures();
        for (Adventure adventure : adventures) {
            for (Reservation reservation : adventure.getReservations()) reservationsDTO.add(new ReservationDTO(reservation));
        }
        return reservationsDTO;
    }

    public List<ReservationDTO> getClientReservations(Person person){
        List<ReservationDTO> reservationsDTO = new ArrayList<>();
        Client client = (Client) person;
        List<Reservation> reservations = client.getReservations();
        for (Reservation reservation : reservations) reservationsDTO.add(new ReservationDTO(reservation));
        return reservationsDTO;
    }

    private Reservation createReservationFromAction(Action action) {
        Reservation reservation = new Reservation();
        reservation.setStartDateTime(action.getStartDateTime());
        reservation.setEndDateTime(action.getEndDateTime());
        reservation.setPersonLimit(action.getPersonLimit());
        reservation.setAdditionalServices(action.getAdditionalServices());
        reservation.setActive(true);
        reservation.setPrice(action.getPrice());
        reservation.setBookable(action.getBookable());
        return reservation;
    }
}