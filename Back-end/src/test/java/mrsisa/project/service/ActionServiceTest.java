package mrsisa.project.service;

import mrsisa.project.dto.ActionDTO;
import mrsisa.project.model.Cottage;
import mrsisa.project.model.Period;
import mrsisa.project.repository.ActionRepository;
import mrsisa.project.repository.BookableRepository;
import mrsisa.project.repository.PeriodRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ActionServiceTest {


    @Mock
    private PeriodService periodService;

    @Mock
    private CottageService cottageService;

    @Mock
    private BookableService bookableService;

    @Mock
    private PeriodRepository periodRepository;


    @Mock
    private PictureService pictureService;
    @Mock
    private ActionRepository actionRepository;
    @Mock
    private BookableRepository bookableRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private TagService  tagService;


    @InjectMocks
    private ActionService actionService;

    @Test
    public void testAdd() throws IOException {
        ActionDTO actionDTO = new ActionDTO();
        actionDTO.setStartDateTime("2022-08-10T02:00:00Z");
        actionDTO.setEndDateTime("2022-09-10T02:00:00Z");
        actionDTO.setExpirationDateTime("2022-09-10T02:00:00Z");
        actionDTO.setPersonLimit(4);
        actionDTO.setPrice(20.0);
        actionDTO.setUsed(true);
        actionDTO.setAdditionalServices(new ArrayList<>());

        Cottage cottage = new Cottage();
        cottage.setId(101L);
        cottage.setName("Vikendan");
        cottage.setPromotionalDescription("Najlepse je kod nas");
        cottage.setPictures(null);
        cottage.setProfilePicture(null);
        cottage.setPriceList(null);
        cottage.setRules("Nema pravila");
        cottage.setActions(new ArrayList<>());
        cottage.setSubscribedClients(new ArrayList<>());

        actionDTO.setBookableId(cottage.getId());

        Period period = new Period();
        period.setId(102L);
        period.setStartDateTime(LocalDateTime.now().plusDays(10));
        period.setEndDateTime(LocalDateTime.now().plusMonths(2));
        period.setBookable(cottage);

        int bookableActionsSizeBefore = cottage.getActions().size();

        when(bookableRepository.getById(actionDTO.getBookableId())).thenReturn(cottage);
        when(periodRepository.findPeriodByBookableIdAndStartBeforeOrEqualAndEndAfterOrEqual(actionDTO.getBookableId(),LocalDateTime.ofInstant(Instant.parse(actionDTO.getStartDateTime()), ZoneOffset.UTC), LocalDateTime.ofInstant(Instant.parse(actionDTO.getEndDateTime()), ZoneOffset.UTC))).thenReturn(java.util.Optional.of(period));
        when(bookableRepository.save(cottage)).thenReturn(cottage);

        boolean actionAdded = actionService.add(actionDTO);

        assertThat(actionAdded).isTrue();
        assertThat(cottage.getActions()).hasSize(bookableActionsSizeBefore + 1);

        verify(bookableRepository, times(1)).getById(cottage.getId());
        verify(bookableRepository, times(2)).save(cottage);
        verifyNoMoreInteractions(bookableRepository);


    }

}
