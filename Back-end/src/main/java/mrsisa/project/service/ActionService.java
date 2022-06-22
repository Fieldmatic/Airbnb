package mrsisa.project.service;

import mrsisa.project.dto.ActionDTO;
import mrsisa.project.model.Action;
import mrsisa.project.model.Bookable;
import mrsisa.project.model.Client;
import mrsisa.project.model.Period;
import mrsisa.project.repository.ActionRepository;
import mrsisa.project.repository.BookableRepository;
import mrsisa.project.repository.PeriodRepository;
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
import java.util.Optional;

@Service
public class ActionService {
    @Autowired
    private ActionRepository actionRepository;
    @Autowired
    private BookableRepository bookableRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PeriodRepository periodRepository;

    @Autowired
    private TagService tagService;

    private final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Transactional
    public boolean add(ActionDTO actionDTO) throws IOException {
        Action action = dtoToAction(actionDTO);
        Bookable bookable = bookableRepository.getById(actionDTO.getBookableId());
        Optional<Period> period = periodRepository.findPeriodByBookableIdAndStartBeforeOrEqualAndEndAfterOrEqual(bookable.getId(),action.getStartDateTime(), action.getEndDateTime());
        if (period.isPresent()){
            replacePeriodWithAction(period.get(),action,bookable);
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
        else return false;
    }

    public void replacePeriodWithAction(Period period, Action action, Bookable bookable){
        if (action.getStartDateTime().isAfter(period.getStartDateTime()) && action.getEndDateTime().isBefore(period.getEndDateTime())){
            Period newPeriod = new Period();
            newPeriod.setStartDateTime(action.getEndDateTime());
            newPeriod.setEndDateTime(period.getEndDateTime());
            newPeriod.setBookable(bookable);
            period.setEndDateTime(action.getStartDateTime());
            bookable.getPeriods().add(newPeriod);
        }
        else if (action.getStartDateTime().isEqual(period.getStartDateTime()) && action.getEndDateTime().isEqual(period.getEndDateTime())){
            periodRepository.delete(period);
        }
        else if (action.getStartDateTime().isEqual(period.getStartDateTime()) && action.getEndDateTime().isBefore(period.getEndDateTime())){
            period.setStartDateTime(action.getEndDateTime());
        }
        else if (action.getStartDateTime().isAfter(period.getStartDateTime()) && action.getEndDateTime().isEqual(period.getEndDateTime())){
            period.setEndDateTime(action.getStartDateTime());
        }
        bookableRepository.save(bookable);

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
        action.setAdditionalServices(tagService.getExistingAdditionalServices(actionDTO.getAdditionalServices()));
        return action;
    }
}
