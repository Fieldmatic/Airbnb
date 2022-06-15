package mrsisa.project.service;

import mrsisa.project.dto.PeriodDTO;
import mrsisa.project.model.Cottage;
import mrsisa.project.model.Period;
import mrsisa.project.repository.BookableRepository;
import mrsisa.project.repository.PeriodRepository;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.hamcrest.CoreMatchers.equalTo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PeriodServiceTest {

    @Mock
    private BookableRepository bookableRepository;

    @Mock
    private PeriodRepository periodRepository;

    @InjectMocks
    private PeriodService periodService;

    @Test
    @Transactional
    public void testAddPeriodService(){
        Cottage cottage = new Cottage();
        List<Period> periods = new ArrayList<Period>();
        cottage.setPeriods(periods);
        when(bookableRepository.getById(1L)).thenReturn(cottage);

        PeriodDTO periodDto = new PeriodDTO();
        periodDto.setBookableId(1L);
        periodDto.setStartDateTime(LocalDateTime.now().plusDays(1) + "Z");
        periodDto.setEndDateTime(LocalDateTime.now().plusDays(5) + "Z");

        Assertions.assertThat(periodService.add(periodDto)).isEqualTo("success");

        Assertions.assertThat(periodService.add(periodDto)).isEqualTo("occupied");

        PeriodDTO newPeriodDto = new PeriodDTO();
        newPeriodDto.setBookableId(1L);
        newPeriodDto.setStartDateTime(LocalDateTime.now().plusDays(4) + "Z");
        newPeriodDto.setEndDateTime(LocalDateTime.now().plusDays(8) + "Z");

        Assertions.assertThat(periodService.add(newPeriodDto)).isEqualTo("extended");

    }
}
