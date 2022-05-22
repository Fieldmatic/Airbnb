package mrsisa.project.service;

import mrsisa.project.dto.CottageDTO;
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
