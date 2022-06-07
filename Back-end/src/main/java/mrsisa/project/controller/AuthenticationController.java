package mrsisa.project.controller;

import mrsisa.project.dto.*;
import mrsisa.project.model.Owner;
import mrsisa.project.model.Person;
import mrsisa.project.model.Role;
import mrsisa.project.repository.PersonRepository;
import mrsisa.project.security.auth.TokenUtils;
import mrsisa.project.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.util.Arrays;

@RestController
@RequestMapping(value = "api/auth")
@CrossOrigin("*")
public class AuthenticationController {

	@Autowired
	private TokenUtils tokenUtils;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private UserService userService;

	@Autowired
	private CottageOwnerService cottageOwnerService;

	@Autowired
	private BoatOwnerService boatOwnerService;

	@Autowired
	private PersonRepository personRepository;

	@Autowired
	private ClientService clientService;

	@Autowired
	private InstructorService instructorService;

	@PostMapping("/login")
	public ResponseEntity<UserTokenState> createAuthenticationToken(
			@RequestBody JwtAuthenticationRequest authenticationRequest, HttpServletResponse response) {

		Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
				authenticationRequest.getUsername(), authenticationRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);

		Person user = (Person) authentication.getPrincipal();
		Role role = user.getRoles().get(0);
		if (Arrays.asList("ROLE_COTTAGE_OWNER","ROLE_BOAT_OWNER","ROLE_INSTRUCTOR").contains(role.getName())) {
			Owner owner = (Owner) user;
			if (!owner.getApprovedAccount()) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
		}
		UserDetails userDetails = userService.loadUserByUsername(user.getUsername());
		if (userDetails != null) {
			String jwt = tokenUtils.generateToken(user.getUsername());
			int expiresIn = tokenUtils.getExpiredIn();

			return ResponseEntity.ok(new UserTokenState(jwt, expiresIn));
		}
		else return null;
	}

	@PostMapping("/ownerRegistration")
	public ResponseEntity<String> addOwner(@RequestPart("owner") PersonDTO dto, @RequestPart("files") MultipartFile[] multiPartFiles) throws IOException {

		Person existUser = (Person) this.userService.loadUserByUsername(dto.getUsername());

		if (existUser != null) {
			return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Username already exists!");
		}

		if (dto.getRole().equals("ROLE_COTTAGE_OWNER")) this.cottageOwnerService.add(dto, java.util.Optional.ofNullable(multiPartFiles));
		else this.boatOwnerService.add(dto, multiPartFiles);

		return ResponseEntity.status(HttpStatus.CREATED).body("Success");
	}

	@GetMapping("/getRole")
	@PreAuthorize("hasAnyRole('ROLE_INSTRUCTOR','ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER','ROLE_CLIENT', 'ROLE_ADMIN')")
	public ResponseEntity<String> getRole(Principal userP){
		Role role = personRepository.findByUsername(userP.getName()).getRoles().get(0);
		return ResponseEntity.status(HttpStatus.OK).body(role.getName());
	}

	
	@PostMapping(value = "/clientRegistration")
	public ResponseEntity<String> addClient(@RequestPart("client") ClientDTO dto, @RequestPart("files") MultipartFile[] multiPartFiles) throws IOException {
		Person existUser = (Person) this.userService.loadUserByUsername(dto.getUsername());

		if (existUser != null) {
			return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Username already exists!");
		}

		if (userService.emailTaken(dto.getEmail())) return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Email is taken!");

		this.clientService.add(dto,multiPartFiles);

		return ResponseEntity.status(HttpStatus.CREATED).body("Success");
	}

	@PostMapping(value = "/instructorRegistration")
	public ResponseEntity<String> addInstructor(@RequestPart("instructor") InstructorDTO dto, @RequestPart("files") MultipartFile[] multiPartFiles) throws IOException {
		Person existUser = (Person) this.userService.loadUserByUsername(dto.getUsername());
		if (existUser != null) {
			return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Username already exists!");
		}
		this.instructorService.add(dto, multiPartFiles);
		return ResponseEntity.status(HttpStatus.CREATED).body("Success");
	}
}