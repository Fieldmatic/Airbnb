package mrsisa.project;

import mrsisa.project.model.*;
import mrsisa.project.repository.ClientRepository;
import mrsisa.project.repository.CottageRepository;
import mrsisa.project.repository.ReservationRepository;
import mrsisa.project.service.AdminService;
import mrsisa.project.service.CottageService;
import mrsisa.project.service.MockupService;
import mrsisa.project.service.PeriodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.IOException;
import java.time.LocalDateTime;

@SpringBootApplication
@EnableAsync
@EnableCaching
@EnableScheduling
public class ProjectApplication implements CommandLineRunner {

	@Autowired
	private AdminService adminService;

	@Autowired
	private CottageRepository cottageRepository;

	@Autowired
	private CottageService cottageService;

	@Autowired
	private ClientRepository clientRepository;

	@Autowired
	private ReservationRepository reservationRepository;

	@Autowired
	private PeriodService periodService;

	@Autowired
	private MockupService mockupService;

	@Override
	public void run(String... args) throws IOException {
		adminService.createFirstAdmin();
		Client client1 = mockupService.createClient1();
		Cottage cottage1 = mockupService.createCottage1();
		mockupService.subscribeClientOnCottage(clientRepository.findClientByUsernameWithSubscriptions(client1.getUsername()), cottage1);
		CottageOwner cottageOwner = mockupService.createCottageOwner1();
		mockupService.addOwnerToCottage(cottageOwner.getUsername(), cottage1.getId());
		mockupService.addPeriodToBookable(cottage1.getId());
		mockupService.addReservation1ToClient(client1.getId(), cottage1.getId());
		mockupService.addReservation2ToClient(client1.getId(), cottage1.getId());
		mockupService.createReview1ForReservation(client1.getId(), cottage1.getId(), cottageOwner.getId());
		mockupService.createReview2ForReservation(client1.getId(), cottage1.getId(), cottageOwner.getId());
		Boat boat1 = mockupService.createBoat1();
		Adventure adventure1 = mockupService.createAdventure1();
		mockupService.addPeriodToBookable(boat1.getId());
		mockupService.addPeriodToBookable(adventure1.getId());

	}

	public static void main(String[] args) {
		SpringApplication.run(ProjectApplication.class, args);
	}

	@Scheduled(cron = "0 0 * * * *")
	public void scheduleReservationEndChecker() {
		for (Reservation reservation: reservationRepository.findAll()){
			if (reservation.getEndDateTime().isBefore(LocalDateTime.now()) && reservation.getActive()) reservation.setActive(false);
		}
	}

	@Scheduled(cron = "0 0 0 1 * *")
	public void resetPenalties(){
		for (Client client : clientRepository.findAll()){
			client.setPenalties(0);
		}
	}

}
