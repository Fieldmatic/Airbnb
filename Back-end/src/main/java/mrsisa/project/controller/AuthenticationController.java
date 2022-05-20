package mrsisa.project.controller;

import mrsisa.project.dto.OwnerDTO;
import mrsisa.project.dto.ClientDTO;
import mrsisa.project.dto.JwtAuthenticationRequest;
import mrsisa.project.dto.UserTokenState;
import mrsisa.project.model.Person;
import mrsisa.project.model.Role;
import mrsisa.project.repository.PersonRepository;
import mrsisa.project.security.auth.TokenUtils;
import mrsisa.project.service.BoatOwnerService;
import mrsisa.project.service.ClientService;
import mrsisa.project.service.CottageOwnerService;
import mrsisa.project.service.UserService;
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

@RestController
@RequestMapping(value = "api/auth")
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

	@PostMapping("/login")
	public ResponseEntity<UserTokenState> createAuthenticationToken(
			@RequestBody JwtAuthenticationRequest authenticationRequest, HttpServletResponse response) {

		Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
				authenticationRequest.getUsername(), authenticationRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);

		Person user = (Person) authentication.getPrincipal();
		UserDetails userDetails = userService.loadUserByUsername(user.getUsername());
		if (userDetails != null) {
			String jwt = tokenUtils.generateToken(user.getUsername());
			int expiresIn = tokenUtils.getExpiredIn();

			return ResponseEntity.ok(new UserTokenState(jwt, expiresIn));
		}
		else return null;
	}

	@PostMapping("/ownerRegistration")
	public ResponseEntity<String> addOwner(@RequestPart("owner") OwnerDTO dto, @RequestPart("files") MultipartFile[] multiPartFiles) throws IOException {

		Person existUser = (Person) this.userService.loadUserByUsername(dto.getUsername());

		if (existUser != null) {
			return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Username already exists!");
		}

		if (dto.getRole().equals("ROLE_COTTAGE_OWNER")) this.cottageOwnerService.add(dto, multiPartFiles);
		else this.boatOwnerService.add(dto, multiPartFiles);

		return ResponseEntity.status(HttpStatus.CREATED).body("Success");
	}

	@GetMapping("/getRole")
	@PreAuthorize("hasAnyRole('ROLE_INSTRUCTOR','ROLE_COTTAGE_OWNER','ROLE_BOAT_OWNER')")
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

		this.clientService.add(dto,multiPartFiles);

		return ResponseEntity.status(HttpStatus.CREATED).body("Success");
	}
}