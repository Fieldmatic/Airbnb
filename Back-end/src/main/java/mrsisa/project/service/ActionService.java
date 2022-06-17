package mrsisa.project.service;

import mrsisa.project.dto.ActionDTO;
import mrsisa.project.model.Action;
import mrsisa.project.model.Bookable;
import mrsisa.project.model.Client;
import mrsisa.project.repository.ActionRepository;
import mrsisa.project.repository.BookableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ActionService {
    @Autowired
    private ActionRepository actionRepository;
    @Autowired
    private BookableRepository bookableRepository;

    @Autowired
    private EmailService emailService;

    private final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Transactional
    public boolean add(ActionDTO actionDTO) throws IOException {
        Action action = dtoToAction(actionDTO);
        Bookable bookable = bookableRepository.getById(actionDTO.getBookableId());
        if (actionPeriodAvailable(bookable, action)) {
            action.setBookable(bookable);
            bookable.getActions().add(action);
            for (Client client: bookable.getSubscribedClients()) {
                try{
                    emailService.sendActionNotificationEmail(client, "One of your subscriptions is on action!", "We have a great offer for you from " + FORMATTER.format(action.getStartDateTime()) + " to " + FORMATTER.format(action.getEndDateTime()) + " for one of your favorites " + bookable.getName());
                } catch(MailException ignored) {
                }
            }
            bookableRepository.save(bookable);
            return true;
        }
        return false;
    }

    public boolean actionPeriodAvailable(Bookable bookable, Action action){
        for (Action a : bookable.getActions()){
            if (a.getStartDateTime().isBefore(action.getStartDateTime()) && a.getEndDateTime().isAfter(action.getEndDateTime())) return false;
            if (action.getStartDateTime().isBefore(a.getStartDateTime()) && action.getEndDateTime().isAfter(a.getEndDateTime())) return false;
            if (action.getStartDateTime().isEqual(a.getStartDateTime()) || action.getEndDateTime().isEqual(a.getEndDateTime())) return false;
        }
        return true;
    }

    public List<ActionDTO> findActions(Long id) {
        List<ActionDTO> actionsDTO = new ArrayList<>();
        for (Action action : actionRepository.findActions(id)) {
            actionsDTO.add(new ActionDTO(action));
        }
        return actionsDTO;
    };


    Action dtoToAction(ActionDTO actionDTO){
        Action action = new Action();
        action.setStartDateTime(LocalDateTime.ofInstant(Instant.parse(actionDTO.getStartDateTime()), ZoneOffset.UTC));
        action.setEndDateTime(LocalDateTime.ofInstant(Instant.parse(actionDTO.getEndDateTime()), ZoneOffset.UTC));
        action.setPersonLimit(actionDTO.getPersonLimit());
        action.setPrice(actionDTO.getPrice());
        action.setUsed(false);
        action.setExpirationDateTime(LocalDateTime.ofInstant(Instant.parse(actionDTO.getExpirationDateTime()), ZoneOffset.UTC));
        action.setExpirationDateTime(LocalDateTime.ofInstant(Instant.parse(actionDTO.getExpirationDateTime()), ZoneOffset.UTC));
        return action;
    }
}
