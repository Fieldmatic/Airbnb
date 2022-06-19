package mrsisa.project.repository;

import mrsisa.project.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {

     @Query(value = "SELECT t FROM Tag t LEFT JOIN FETCH t.bookables where t.name=?1")
     Tag findByName(String name);
     @Query(value = "SELECT t FROM Tag t LEFT JOIN FETCH t.bookables b where b.id=?1")
     List<Tag> findByBookableId(Long id);

     @Query(value = "select * from tag t left join tag_bookables b on t.id = b.tag_id where b.bookables_id = ?1", nativeQuery = true)
     List<Tag> getTagsOfBookable(Long id);

}
