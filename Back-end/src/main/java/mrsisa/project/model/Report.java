package mrsisa.project.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@NoArgsConstructor
@Data
@Entity
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true)
    private Long id;
    private String comment;
    private boolean showedUp;
    private boolean viewed;
    private ReportType type;
    @ManyToOne
    private Client client;
    @OneToOne
    private Reservation reservation;
}
