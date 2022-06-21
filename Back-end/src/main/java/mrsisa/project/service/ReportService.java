package mrsisa.project.service;

import mrsisa.project.dto.ReportDTO;
import mrsisa.project.model.*;
import mrsisa.project.repository.ClientRepository;
import mrsisa.project.repository.OwnerRepository;
import mrsisa.project.repository.ReportRepository;
import mrsisa.project.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OwnerRepository ownerRepository;

    @Transactional
    public boolean add(ReportDTO reportDTO) {
        Report report = dtoToReport(reportDTO);
        Client client = clientRepository.getByEmail(reportDTO.getClientEmail());
        Reservation reservation = reservationRepository.getById(reportDTO.getReservationId());
        report.setClient(clientRepository.getByEmail(reportDTO.getClientEmail()));
        report.setReservation(reservationRepository.getById(reportDTO.getReservationId()));
        report.setViewed(false);
        reservation.setReport(report);
        client.getReports().add(report);
        if (!report.isShowedUp()) client.setPenalties(client.getPenalties() + 1);
        reportRepository.save(report);
        clientRepository.save(client);
        reservationRepository.save(reservation);
        return true;
    }

    Report dtoToReport(ReportDTO reportDTO){
        Report report = new Report();
        report.setComment(reportDTO.getComment());
        report.setType(reportDTO.getType());
        report.setShowedUp(reportDTO.isShowedUp());
        return report;
    }

    @Transactional
    public Report findByReservationId(Long id){ return reportRepository.findByReservationId(id);}

    public List<ReportDTO> getAllReports() {
        List<ReportDTO> reportDTOS = new ArrayList<>();
        for(Report report : reportRepository.findAll()) {
            if (!report.isViewed() && report.getType() == ReportType.REQUEST_PENALTY)
                reportDTOS.add(new ReportDTO(report));
        }
        return reportDTOS;
    }

    public void reviewReport(Report report, String message, boolean penalty) {
        report.setViewed(true);
        Client client = report.getClient();
        if (penalty) {
            client.setPenalties(client.getPenalties() + 1);
            clientRepository.save(client);
        }
        reportRepository.save(report);
        Owner owner = ownerRepository.findByUsername(report.getOwnerUsername());
        emailService.sendReportMail(client, owner, message, penalty);
    }
}
