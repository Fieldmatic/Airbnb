package mrsisa.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import mrsisa.project.model.Client;
import mrsisa.project.model.Report;
import mrsisa.project.model.ReportType;
import mrsisa.project.model.Reservation;

import javax.persistence.*;

@Data
@NoArgsConstructor
public class ReportDTO {
    private Long reservationId;
    private String comment;
    private boolean showedUp;
    private ReportType type;
    private String clientEmail;
    private String client;

    public ReportDTO(Report report) {
        this.reservationId = report.getReservation().getId();
        this.comment = report.getComment();
        this.showedUp = report.isShowedUp();
        this.type = report.getType();
        this.clientEmail = report.getClient().getEmail();
        this.client = report.getClient().getUsername();
    }
}
