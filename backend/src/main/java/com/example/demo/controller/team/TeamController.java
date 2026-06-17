package com.example.demo.controller.team;

import com.example.demo.dto.team.CreateTeamRequest;
import com.example.demo.dto.team.JoinTeamRequest;
import com.example.demo.dto.team.TeamResponse;
import com.example.demo.service.team.TeamService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping("/events/{eventId}/teams")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<TeamResponse> createTeam(
            @PathVariable Long eventId,
            @RequestBody(required = false) CreateTeamRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(teamService.createTeam(eventId, request == null ? new CreateTeamRequest() : request));
    }

    @PostMapping("/teams/join")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<TeamResponse> joinTeam(@Valid @RequestBody JoinTeamRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(teamService.joinTeam(request));
    }

    @GetMapping("/teams/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<TeamResponse>> listMyTeams() {
        return ResponseEntity.ok(teamService.listMyTeams());
    }

    @GetMapping("/teams/{teamId}")
    public ResponseEntity<TeamResponse> getTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.getTeam(teamId));
    }

    @GetMapping("/events/{eventId}/teams")
    public ResponseEntity<List<TeamResponse>> listTeamsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(teamService.listTeamsByEvent(eventId));
    }

    @PostMapping("/teams/{teamId}/leave")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> leaveTeam(@PathVariable Long teamId) {
        teamService.leaveTeam(teamId);
        return ResponseEntity.noContent().build();
    }
}

