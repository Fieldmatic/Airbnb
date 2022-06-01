package mrsisa.project;

import mrsisa.project.model.Address;
import mrsisa.project.model.Cottage;
import mrsisa.project.model.Tag;
import mrsisa.project.repository.CottageRepository;
import mrsisa.project.service.AdminService;
import mrsisa.project.service.CottageService;
import mrsisa.project.service.PeriodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class ProjectApplication implements CommandLineRunner {

	@Autowired
	private AdminService adminService;

	@Autowired
	private CottageService cottageService;

	@Autowired
	private PeriodService periodService;

	@Override
	public void run(String... args) {
		this.adminService.createFirstAdmin();

		/*Cottage cottage = this.cottageService.createFirstCottage();
		this.periodService.createPeriodForCottage(cottage);*/

	}

	public static void main(String[] args) {
		SpringApplication.run(ProjectApplication.class, args);
	}

}
