package mrsisa.project.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true)
    private Long id;
    private String comment;
    private boolean showedUp;
    private boolean viewed;
    private String ownerUsername;
    private ReportType type;
    @ManyToOne
    private Client client;
    @OneToOne
    private Reservation reservation;
}
