package mrsisa.project.service;

import mrsisa.project.dto.ComplaintDTO;
import mrsisa.project.model.Bookable;
import mrsisa.project.model.Complaint;
import mrsisa.project.model.Owner;
import mrsisa.project.model.Reservation;
import mrsisa.project.repository.BookableRepository;
import mrsisa.project.repository.ComplaintRepository;
import mrsisa.project.repository.OwnerRepository;
import mrsisa.project.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ComplaintService {
    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private BookableRepository bookableRepository;

    @Autowired
    private OwnerRepository ownerRepository;


    public boolean checkIfComplained(String complaint) {
        if (complaint.isEmpty())
            return false;
        return true;
    }

    @Transactional
    public boolean add(ComplaintDTO complaintDTO) {
        Optional<Complaint> complaint = complaintRepository.findComplaintByReservation_Id(complaintDTO.getReservationId());
        if (complaint.isPresent()) {
            Complaint compl = complaint.get();
            if (!compl.getReservation().getOwnerComplained()) {
                compl.setOwnerComment(complaintDTO.getOwnerComment());
                compl.getReservation().setOwnerComplained(true);
            } else {
                compl.setBookableComment(complaintDTO.getBookableComment());
                compl.getReservation().setBookableComplained(true);
            }
            reservationRepository.save(compl.getReservation());
            complaintRepository.save(compl);
        } else {
            Complaint newComplaint = dtoToComplaint(complaintDTO);

            Bookable bookable = bookableRepository.getByIdWithComplaints(complaintDTO.getBookableId());
            newComplaint.setBookable(bookableRepository.getById(complaintDTO.getBookableId()));
            Reservation reservation = reservationRepository.getById(complaintDTO.getReservationId());
            newComplaint.setReservation(reservation);
            Owner owner = ownerRepository.getByIdWithComplaints(complaintDTO.getOwnerId());
            newComplaint.setOwner(ownerRepository.getById(complaintDTO.getOwnerId()));

            owner.getComplaints().add(newComplaint);
            bookable.getComplaints().add(newComplaint);
            reservation.setOwnerComplained(checkIfComplained(newComplaint.getOwnerComment()));
            reservation.setBookableComplained(checkIfComplained(newComplaint.getBookableComment()));
            reservation.setComplaint(newComplaint);
            complaintRepository.save(newComplaint);
            bookableRepository.save(bookable);
            ownerRepository.save(owner);
        }
        return true;
    }

    Complaint dtoToComplaint(ComplaintDTO complaintDTO){
        Complaint complaint = new Complaint();
        complaint.setBookableComment(complaintDTO.getBookableComment());
        complaint.setOwnerComment(complaintDTO.getOwnerComment());
        return complaint;
    }
}
