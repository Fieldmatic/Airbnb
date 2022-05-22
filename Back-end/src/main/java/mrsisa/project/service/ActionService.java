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
import java.util.ArrayList;
import java.util.List;

@Service
public class ActionService {
    @Autowired
    private ActionRepository actionRepository;
    @Autowired
    private BookableRepository bookableRepository;

    @Transactional
    public void add(ActionDTO actionDTO) throws IOException {
        dtoToAction(actionDTO);
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
        action.setExpirationDate(LocalDateTime.ofInstant(Instant.parse(actionDTO.getExpirationDate()), ZoneOffset.UTC));
        Bookable bookable = bookableRepository.getById(actionDTO.getBookableId());
        action.setBookable(bookable);
        bookable.getActions().add(action);
        bookableRepository.save(bookable);
        return action;
    }
}
