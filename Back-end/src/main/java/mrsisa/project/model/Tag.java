package mrsisa.project.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany
    private List<Bookable> bookables = new ArrayList<>();

    public Tag(String name, Bookable bookable) {
        this.name = name;
        this.bookables.add(bookable);
    }

    public Tag(String name) {
        this.name = name;
    }

}