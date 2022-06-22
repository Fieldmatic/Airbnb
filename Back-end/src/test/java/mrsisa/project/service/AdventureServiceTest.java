package mrsisa.project.service;


import mrsisa.project.model.Adventure;
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
        Review review1 = new Review();
        review1.setAnswered(true);
        Review review2 = new Review();
        review2.setAnswered(false);
        Review review3 = new Review();
        review3.setAnswered(true);
        reviews.add(review1);
        reviews.add(review2);
        reviews.add(review3);
        Adventure adventure = new Adventure();
        adventure.setReviews(reviews);
        when(adventureRepository.findByIdWithReviews(1L)).thenReturn(adventure);

        assertEquals((int) adventureService.getNumberOfReviews(1L),2);

        verify(adventureRepository,times(1)).findByIdWithReviews(1L);
        verifyNoMoreInteractions(adventureRepository);
    }
}
