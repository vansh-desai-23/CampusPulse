package com.example.demo.repository.team;

import com.example.demo.model.team.TeamMember;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    long countByTeam_Id(Long teamId);

    boolean existsByUser_IdAndTeam_Event_Id(Long userId, Long eventId);

    List<TeamMember> findAllByTeam_IdOrderByIdAsc(Long teamId);

    List<TeamMember> findAllByUser_IdOrderByIdDesc(Long userId);
}
