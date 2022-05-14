package mrsisa.project.controller;

import mrsisa.project.dto.CottageOwnerDTO;
import mrsisa.project.dto.JwtAuthenticationRequest;
import mrsisa.project.dto.UserTokenState;
import mrsisa.project.exception.ResourceConflictException;
import mrsisa.project.model.CottageOwner;
import mrsisa.project.model.Person;
import mrsisa.project.security.auth.TokenUtils;
import mrsisa.project.service.CottageOwnerService;
import mrsisa.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

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
	public ResponseEntity<String> addOwner(@RequestPart("owner") CottageOwnerDTO dto, @RequestPart("files") MultipartFile[] multiPartFiles) throws IOException {

		Person existUser = (Person) this.userService.loadUserByUsername(dto.getUsername());

		if (existUser != null) {
			return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Username already exists!");
		}

		Person user = this.cottageOwnerService.add(dto,multiPartFiles);

		return ResponseEntity.status(HttpStatus.CREATED).body("Success");
	}
}