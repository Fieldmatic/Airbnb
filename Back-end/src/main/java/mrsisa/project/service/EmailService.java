package mrsisa.project.service;

import mrsisa.project.model.Bookable;
import mrsisa.project.model.Person;
import mrsisa.project.model.Reservation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private Environment env;

    private static final String DENIAL_REGISTRATION_MESSAGE = ",\n\nWe are sorry, but your registration request can not be " +
            "accepted. Here is why:\n";

    private static final String ACCEPT_REGISTRATION_MESSAGE = ",\n\nWe are glad to tell you that your registration request" +
            " is accepted! Thank you for using our site.\n\nEnjoy! :)";

    private static final String ACCEPT_DELETION_MESSAGE = ",\n\nWe are sorry to hear that you are leaving us." +
            " We hope we will see you soon again.\n\nBye! :(";

    private static final String DENIAL_DELETION_MESSAGE = ",\n\nWe are sorry, but your deletion request can not be " +
            "accepted. Here is why:\n";

    private SimpleMailMessage getMailMessage(Person user, String title) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(user.getEmail());
        mail.setFrom(Objects.requireNonNull(env.getProperty("spring.mail.username")));
        mail.setSubject(title);
        return mail;
    }

    @Async
    public void sendRegistrationEmail(Person user, String title, String message, boolean isRegister) throws MailException {
        SimpleMailMessage mail = getMailMessage(user, title);
        if (isRegister)
            mail.setText("Hello " + user.getName() + ACCEPT_REGISTRATION_MESSAGE);
        else
            mail.setText("Hello " + user.getName() + DENIAL_REGISTRATION_MESSAGE + message);
        javaMailSender.send(mail);
    }

    @Async
    public void sendAccountDeletionEmail(Person user, String title, String message, boolean isDeleted) throws MailException {
        SimpleMailMessage mail = getMailMessage(user, title);
        if (isDeleted)
            mail.setText("Hello " + user.getName() + ACCEPT_DELETION_MESSAGE);
        else
            mail.setText("Hello " + user.getName() + DENIAL_DELETION_MESSAGE + message);
        javaMailSender.send(mail);
    }

    @Async
    public void sendReservationMail(Person user, Reservation reservation) throws MailException {
        SimpleMailMessage mail = getMailMessage(user, "Reservation");
        LocalDateTime startDateTime = reservation.getStartDateTime();
        LocalDateTime endDateTime = reservation.getEndDateTime();
        mail.setText("Hello " + user.getName() + ",\n\n\n" + "You have successfully booked a " + reservation.getBookable().getName() +"." +
                    "\n\n\nRESERVATION DETAILS\n\nReservation starts: " + startDateTime.getMonth() + " " + startDateTime.getDayOfMonth() + ", " + startDateTime.getYear() + " at " + startDateTime.getHour() + ":" + (startDateTime.getMinute()<10 ? '0' : ' ') + startDateTime.getMinute() +
                    "\nReservation ends: " + endDateTime.getMonth() + " " + endDateTime.getDayOfMonth() + ", " + endDateTime.getYear() + " at " + endDateTime.getHour() + ":" + (endDateTime.getMinute()<10 ? '0' : ' ') + endDateTime.getMinute() +
                    "\nPrice: " + reservation.getPrice() +
                    "\nNumber of guests: " + reservation.getPersonLimit() +
                    "\n\n\nWe wish you a good time!, \n\n\nBest regards, \nAirBnb team");

        javaMailSender.send(mail);
    }
}
