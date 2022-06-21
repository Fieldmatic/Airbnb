package mrsisa.project;

import mrsisa.project.model.Client;
import mrsisa.project.repository.ClientRepository;
import mrsisa.project.service.AdminService;
import mrsisa.project.service.CottageService;
import mrsisa.project.service.PeriodService;
import mrsisa.project.model.Address;
import mrsisa.project.model.Cottage;
import mrsisa.project.model.Tag;
import mrsisa.project.repository.CottageRepository;
import mrsisa.project.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
@EnableAsync
@EnableCaching
public class ProjectApplication implements CommandLineRunner {

	@Autowired
	private AdminService adminService;

	@Autowired
	private CottageService cottageService;

	@Autowired
	private ClientRepository clientRepository;

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


	}

	public static void main(String[] args) {
		SpringApplication.run(ProjectApplication.class, args);
	}

}
