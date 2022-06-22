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
    @Version
    @Column(name = "optLock", columnDefinition = "integer DEFAULT 0", nullable = false)
    private Integer version;
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
