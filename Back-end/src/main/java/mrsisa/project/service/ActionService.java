package mrsisa.project.service;

import mrsisa.project.dto.ActionDTO;
import mrsisa.project.model.Action;
import mrsisa.project.model.Bookable;
import mrsisa.project.repository.ActionRepository;
import mrsisa.project.repository.BookableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ActionService {
    @Autowired
    private ActionRepository actionRepository;
    @Autowired
    private BookableRepository bookableRepository;

    public void add(ActionDTO actionDTO) throws IOException {
        dtoToAction(actionDTO);
    }


    private Action dtoToAction(ActionDTO actionDTO){
        Action action = new Action();
        action.setStartDateTime(actionDTO.getStartDateTime());
        action.setEndDateTime(actionDTO.getEndDateTime());
        action.setPersonLimit(actionDTO.getPersonLimit());
        action.setPrice(actionDTO.getPrice());
        action.setExpirationDate(actionDTO.getExpirationDate());
        Bookable bookable = bookableRepository.getById(actionDTO.getBookableId());
        action.setBookable(bookable);
        bookable.getActions().add(action);
        bookableRepository.save(bookable);
        return action;
    }
}
