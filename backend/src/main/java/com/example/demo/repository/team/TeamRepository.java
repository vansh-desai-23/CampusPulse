package com.example.demo.repository.team;

import com.example.demo.model.team.Team;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByInviteCode(String inviteCode);

    boolean existsByInviteCode(String inviteCode);

    List<Team> findAllByEvent_IdOrderByIdAsc(Long eventId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from Team t where t.inviteCode = :inviteCode")
    Optional<Team> findByInviteCodeForUpdate(@Param("inviteCode") String inviteCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from Team t where t.id = :id")
    Optional<Team> findByIdForUpdate(@Param("id") Long id);
}
