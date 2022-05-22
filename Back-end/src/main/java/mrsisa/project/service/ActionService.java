package mrsisa.project.service;

import mrsisa.project.dto.ActionDTO;
import mrsisa.project.model.Action;
import mrsisa.project.model.Bookable;
import mrsisa.project.repository.ActionRepository;
import mrsisa.project.repository.BookableRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Transactional
    public boolean add(ActionDTO actionDTO) throws IOException {
        Action action = dtoToAction(actionDTO);
        Bookable bookable = bookableRepository.getById(actionDTO.getBookableId());
        if (actionPeriodAvailable(bookable, action)) {
            action.setBookable(bookable);
            bookable.getActions().add(action);
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
        action.setExpirationDateTime(LocalDateTime.ofInstant(Instant.parse(actionDTO.getExpirationDateTime()), ZoneOffset.UTC));
        action.setExpirationDate(LocalDateTime.ofInstant(Instant.parse(actionDTO.getExpirationDate()), ZoneOffset.UTC));
        return action;
    }
}
