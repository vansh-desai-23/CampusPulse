package com.example.demo.repository.fest;

import com.example.demo.model.fest.Fest;
import com.example.demo.model.fest.FestStatus;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FestRepository extends JpaRepository<Fest, Long> {

    List<Fest> findAllByStatusOrderByFestStartTimeAsc(FestStatus status);

    List<Fest> findTop4ByStatusOrderByCreatedAtDescIdDesc(FestStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select f from Fest f where f.id = :id")
    Optional<Fest> findByIdForUpdate(@Param("id") Long id);
}
