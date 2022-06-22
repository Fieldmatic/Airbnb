package mrsisa.project.service;

import mrsisa.project.model.Client;
import mrsisa.project.model.Owner;
import mrsisa.project.model.Person;
import mrsisa.project.model.Reservation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

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
    public void sendActionNotificationEmail(Client client, String title, String message) throws MailException {
        SimpleMailMessage mail = getMailMessage(client, title);
        mail.setText("Hello " + client.getName() + ",\n\n" + message + "\n\n" + "Kind regards,\nAirbnb Team");
        javaMailSender.send(mail);
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
                    "\n\n\nWe wish you a good time! \n\n\nBest regards, \nAirBnb team");

        javaMailSender.send(mail);
    }


    @Async
    public void sendReportMail(Client client, Owner owner, String message, boolean penalty) {
        SimpleMailMessage mail1 = getMailMessage(client, "Complaint");
        SimpleMailMessage mail2 = getMailMessage(owner, "Complaint");
        if (penalty) {
            mail1.setText("Hello " + client.getName() + ", \n\n\nYour behavior has been appealed and you have got" +
                    " a penalty.\nHere is what admin said: " + message);
            mail2.setText("Hello " + owner.getName() + ", \n\n\nWe appreciate your complaint and client has got" +
                    "a penalty.\nHere is what admin said: " + message);
        }
        else {
            mail1.setText("Hello " + client.getName() + ", \n\n\nYour behavior has been appealed but you have not got" +
                    " a penalty.\nHere is what admin said: " + message);
            mail2.setText("Hello " + owner.getName() + ", \n\n\nWe appreciate your complaint but client has not got" +
                    "a penalty.\nHere is what admin said: " + message);
        }
        javaMailSender.send(mail1, mail2);
    }

    @Async
    public void sendReviewMail(Owner owner, String ownerMessage, String bookableMessage) {
        SimpleMailMessage mail = getMailMessage(owner, "New review for you");
        mail.setText("Hello " + owner.getName() + ", \n\n\nYou got a new review. Here is what client had to say" +
                "about you: " + ownerMessage + "\n\nAlso, this is his experience: " + bookableMessage);
        javaMailSender.send(mail);
    }

    @Async
    public void sendUserVerificationMail(Client client) {

        SimpleMailMessage mail1 = getMailMessage(client, "Registration");
        mail1.setText("Dear,\n"+client.getName()+"\n\n\"You have successfully created a profile on AirBnb. Your account is connected with this mail, but still not verified. You will not be able " +
                "to login until you verify your account. To verify your account, please follow this link: \n" +
                "https://airbnbexperiences.herokuapp.com/verification/"+client.getUsername()+" \n\n\nThank you for using AirBnb service");
        javaMailSender.send(mail1);
    }

}
