package mrsisa.project.service;


import mrsisa.project.model.Adventure;
import mrsisa.project.model.Cottage;
import mrsisa.project.model.Review;
import mrsisa.project.repository.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AdventureServiceTest {

    @Mock
    AdventureRepository adventureRepository;

    @Mock
    AddressRepository addressRepository;

    @Mock
    PriceListRepository priceListRepository;

    @Mock
    InstructorRepository instructorRepository;

    @Mock
    PersonRepository personRepository;

    @Mock
    ReservationRepository reservationRepository;

    @Mock
    TagService tagService;

    @InjectMocks
    AdventureService adventureService;

    @Test
    public void testFindOne(){
        List<Review> reviews = new ArrayList<Review>();
        reviews.add(new Review());
        reviews.add(new Review());
        Adventure adventure = new Adventure();
        adventure.setReviews(reviews);
        when(adventureRepository.findByIdWithReviews(1L)).thenReturn(adventure);

        assertEquals((int) adventureService.getNumberOfReviews(1L),adventure.getReviews().size());

        verify(adventureRepository,times(1)).findByIdWithReviews(1L);
        verifyNoMoreInteractions(adventureRepository);
    }
}
