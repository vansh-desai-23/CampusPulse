package com.example.demo.service.team;

import com.example.demo.dto.UserRole;
import com.example.demo.dto.team.CreateTeamRequest;
import com.example.demo.dto.team.JoinTeamRequest;
import com.example.demo.dto.team.TeamResponse;
import com.example.demo.dto.team.TeamResponse.TeamMemberView;
import com.example.demo.model.User;
import com.example.demo.model.event.Event;
import com.example.demo.model.fest.FestStatus;
import com.example.demo.model.team.Team;
import com.example.demo.model.team.TeamMember;
import com.example.demo.model.team.TeamMemberStatus;
import com.example.demo.repository.event.EventRepository;
import com.example.demo.repository.team.TeamMemberRepository;
import com.example.demo.repository.team.TeamRepository;
import com.example.demo.service.security.CurrentUserService;
import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TeamService {

    private final EventRepository eventRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final CurrentUserService currentUserService;
    private final Clock clock;

    public TeamService(
            EventRepository eventRepository,
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            CurrentUserService currentUserService) {
        this.eventRepository = eventRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.currentUserService = currentUserService;
        this.clock = Clock.systemUTC();
    }

    @Transactional
    public TeamResponse createTeam(Long eventId, CreateTeamRequest request) {
        currentUserService.requireRole(UserRole.STUDENT);
        User currentUser = currentUserService.getCurrentUser();
        Event event = eventRepository.findByIdForUpdate(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        validateBookingEligibility(event, currentUser);
        ensureUserNotAlreadyRegistered(currentUser, event);
        ensureCapacityAvailable(event);

        Team team = new Team();
        team.setEvent(event);
        team.setLeader(currentUser);
        team.setTeamName(normalizeOptionalText(request.getTeamName()));
        team = persistTeamWithUniqueInviteCode(team);

        TeamMember leaderMember = new TeamMember();
        leaderMember.setTeam(team);
        leaderMember.setUser(currentUser);
        leaderMember.setStatus(TeamMemberStatus.CONFIRMED);
        teamMemberRepository.save(leaderMember);

        event.setCurrentBookings(event.getCurrentBookings() + 1);
        return toResponse(team);
    }

    @Transactional
    public TeamResponse joinTeam(JoinTeamRequest request) {
        currentUserService.requireRole(UserRole.STUDENT);
        User currentUser = currentUserService.getCurrentUser();
        String inviteCode = normalizeInviteCode(request.getInviteCode());

        Team team = teamRepository.findByInviteCodeForUpdate(inviteCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invite code not found"));
        Event event = eventRepository.findByIdForUpdate(team.getEvent().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        validateBookingEligibility(event, currentUser);
        ensureUserNotAlreadyRegistered(currentUser, event);

        long currentMembers = teamMemberRepository.countByTeam_Id(team.getId());
        if (currentMembers >= event.getMaxTeamSize()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Team is full");
        }

        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setUser(currentUser);
        member.setStatus(TeamMemberStatus.CONFIRMED);
        teamMemberRepository.save(member);

        return toResponse(team);
    }

    @Transactional(readOnly = true)
    public TeamResponse getTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
        User currentUser = currentUserService.getCurrentUser();
        if (!canViewTeam(currentUser, team)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found");
        }
        return toResponse(team);
    }

    @Transactional(readOnly = true)
    public List<TeamResponse> listTeamsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        User currentUser = currentUserService.getCurrentUser();
        if (!canViewEvent(currentUser, event)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
        }
        return teamRepository.findAllByEvent_IdOrderByIdAsc(eventId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TeamResponse> listMyTeams() {
        currentUserService.requireRole(UserRole.STUDENT);
        User currentUser = currentUserService.getCurrentUser();
        return teamMemberRepository.findAllByUser_IdOrderByIdDesc(currentUser.getId()).stream()
                .map(TeamMember::getTeam)
                .map(this::toResponse)
                .toList();
    }

    private void validateBookingEligibility(Event event, User currentUser) {
        if (event.getFest() == null || event.getFest().getStatus() != FestStatus.PUBLISHED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bookings are not open for this event");
        }

        LocalDateTime now = LocalDateTime.now(clock.withZone(ZoneOffset.UTC));
        if (now.isBefore(event.getRegistrationStart()) || !now.isBefore(event.getRegistrationEnd())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Registration window is closed");
        }
        if (event.getFest().getOwnedBy() != null
                && event.getFest().getOwnedBy().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Organizers cannot register for student bookings");
        }
    }

    private void ensureUserNotAlreadyRegistered(User user, Event event) {
        if (teamMemberRepository.existsByUser_IdAndTeam_Event_Id(user.getId(), event.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User is already registered for this event");
        }
    }

    private void ensureCapacityAvailable(Event event) {
        if (event.getCurrentBookings() >= event.getMaxCapacity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Event capacity has been reached");
        }
    }

    private boolean canViewTeam(User currentUser, Team team) {
        if (currentUserService.isOrganizer(currentUser)
                && team.getEvent().getFest().getOwnedBy() != null
                && team.getEvent().getFest().getOwnedBy().getId().equals(currentUser.getId())) {
            return true;
        }
        return teamMemberRepository.existsByUser_IdAndTeam_Event_Id(currentUser.getId(), team.getEvent().getId());
    }

    private boolean canViewEvent(User currentUser, Event event) {
        if (event.getFest().getStatus() == FestStatus.PUBLISHED) {
            return true;
        }
        return currentUserService.isOrganizer(currentUser)
                && event.getFest().getOwnedBy() != null
                && event.getFest().getOwnedBy().getId().equals(currentUser.getId());
    }

    private String normalizeInviteCode(String inviteCode) {
        if (inviteCode == null || inviteCode.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invite code is required");
        }
        return inviteCode.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private String generateUniqueInviteCode() {
        for (int attempt = 0; attempt < 10; attempt++) {
            String code = UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
            if (!teamRepository.existsByInviteCode(code)) {
                return code;
            }
        }
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to generate invite code");
    }

    private Team persistTeamWithUniqueInviteCode(Team team) {
        for (int attempt = 0; attempt < 10; attempt++) {
            team.setInviteCode(generateUniqueInviteCode());
            try {
                return teamRepository.save(team);
            } catch (DataIntegrityViolationException ex) {
                if (attempt == 9) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Unable to reserve a unique invite code");
                }
            }
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Unable to reserve a unique invite code");
    }

    private TeamResponse toResponse(Team team) {
        List<TeamMember> members = teamMemberRepository.findAllByTeam_IdOrderByIdAsc(team.getId());
        TeamResponse response = new TeamResponse();
        response.setId(team.getId());
        response.setTeamName(team.getTeamName());
        response.setInviteCode(team.getInviteCode());
        response.setEventId(team.getEvent().getId());
        response.setEventName(team.getEvent().getName());
        response.setFestId(team.getEvent().getFest().getId());
        response.setFestName(team.getEvent().getFest().getName());
        response.setLeaderId(team.getLeader().getId());
        response.setLeaderName(team.getLeader().getName());
        response.setLeaderEmail(team.getLeader().getEmail());
        response.setMemberCount(members.size());
        response.setMaxTeamSize(team.getEvent().getMaxTeamSize());
        response.setEventCurrentBookings(team.getEvent().getCurrentBookings());
        response.setEventMaxCapacity(team.getEvent().getMaxCapacity());
        response.setMembers(members.stream().map(member -> {
            TeamMemberView view = new TeamMemberView();
            view.setUserId(member.getUser().getId());
            view.setName(member.getUser().getName());
            view.setEmail(member.getUser().getEmail());
            view.setStatus(member.getStatus());
            return view;
        }).toList());
        return response;
    }
}
