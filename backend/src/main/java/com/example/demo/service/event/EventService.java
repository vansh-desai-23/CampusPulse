package com.example.demo.service.event;

import com.example.demo.dto.UserRole;
import com.example.demo.dto.event.EventCreateRequest;
import com.example.demo.dto.event.EventResponse;
import com.example.demo.dto.event.EventUpdateRequest;
import com.example.demo.model.User;
import com.example.demo.model.event.Event;
import com.example.demo.model.fest.Fest;
import com.example.demo.model.fest.FestStatus;
import com.example.demo.repository.event.EventRepository;
import com.example.demo.repository.fest.FestRepository;
import com.example.demo.repository.team.TeamMemberRepository;
import com.example.demo.model.team.TeamMember;
import com.example.demo.repository.team.TeamMemberRepository;
import com.example.demo.repository.team.TeamRepository;
import com.example.demo.service.security.CurrentUserService;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.List;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EventService {

    private final FestRepository festRepository;
    private final EventRepository eventRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final CurrentUserService currentUserService;

    public EventService(
            FestRepository festRepository,
            EventRepository eventRepository,
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            CurrentUserService currentUserService) {
        this.festRepository = festRepository;
        this.eventRepository = eventRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public EventResponse createEvent(Long festId, EventCreateRequest request) {
        User currentUser = requireOrganizer();
        Fest fest = festRepository.findByIdForUpdate(festId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fest not found"));
        requireOwnership(currentUser, fest);

        LocalDateTime registrationStart = request.getRegistrationStart();
        LocalDateTime registrationEnd = request.getRegistrationEnd();
        LocalDateTime physicalStart = request.getPhysicalEventStart();
        LocalDateTime physicalEnd = request.getPhysicalEventEnd();
        validateEventTimeline(fest, registrationStart, registrationEnd, physicalStart, physicalEnd);

        Event event = new Event();
        event.setFest(fest);
        event.setName(request.getName().trim());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue().trim());
        event.setEventBannerUrl(request.getEventBannerUrl());
        event.setMaxCapacity(request.getMaxCapacity());
        event.setMaxTeamSize(request.getMaxTeamSize() == null ? 1 : request.getMaxTeamSize());
        event.setRegistrationStart(registrationStart);
        event.setRegistrationEnd(registrationEnd);
        event.setPhysicalEventStart(physicalStart);
        event.setPhysicalEventEnd(physicalEnd);

        return toResponse(eventRepository.save(event));
    }

    @Transactional(readOnly = true)
    public List<EventResponse> listEventsByFest(Long festId) {
        Fest fest = festRepository.findById(festId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fest not found"));
        User currentUser = currentUserService.getCurrentUser();
        if (!canViewFest(currentUser, fest)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fest not found");
        }
        return eventRepository.findAllByFest_IdOrderByPhysicalEventStartAsc(festId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse getEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        User currentUser = currentUserService.getCurrentUser();
        if (!canViewFest(currentUser, event.getFest())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
        }
        return toResponse(event);
    }

    @Transactional
    public EventResponse updateEvent(Long eventId, EventUpdateRequest request) {
        User currentUser = requireOrganizer();
        Event event = eventRepository.findByIdForUpdate(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        requireOwnership(currentUser, event.getFest());

        LocalDateTime registrationStart = resolve(request.getRegistrationStart(), event.getRegistrationStart());
        LocalDateTime registrationEnd = resolve(request.getRegistrationEnd(), event.getRegistrationEnd());
        LocalDateTime physicalStart = resolve(request.getPhysicalEventStart(), event.getPhysicalEventStart());
        LocalDateTime physicalEnd = resolve(request.getPhysicalEventEnd(), event.getPhysicalEventEnd());
        validateEventTimeline(event.getFest(), registrationStart, registrationEnd, physicalStart, physicalEnd);

        int maxCapacity = request.getMaxCapacity() != null ? request.getMaxCapacity() : event.getMaxCapacity();
        int maxTeamSize = request.getMaxTeamSize() != null ? request.getMaxTeamSize() : event.getMaxTeamSize();
        if (maxCapacity < event.getCurrentBookings()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max capacity cannot be less than current bookings");
        }
        if (maxTeamSize < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max team size must be at least 1");
        }
        ensureExistingTeamsFit(event.getId(), maxTeamSize);

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            event.setName(request.getName().trim());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }
        if (request.getVenue() != null && !request.getVenue().trim().isEmpty()) {
            event.setVenue(request.getVenue().trim());
        }
        if (request.getEventBannerUrl() != null) {
            event.setEventBannerUrl(request.getEventBannerUrl());
        }
        event.setMaxCapacity(maxCapacity);
        event.setMaxTeamSize(maxTeamSize);
        event.setRegistrationStart(registrationStart);
        event.setRegistrationEnd(registrationEnd);
        event.setPhysicalEventStart(physicalStart);
        event.setPhysicalEventEnd(physicalEnd);

        return toResponse(event);
    }

    @Transactional(readOnly = true)
    public byte[] exportRoster(Long eventId) {
        User currentUser = requireOrganizer();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        requireOwnership(currentUser, event.getFest());

        if (event.getRegistrationEnd().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration has not closed yet. Roster export is locked.");
        }

        List<TeamMember> members = teamMemberRepository.findAllByTeam_Event_IdOrderByIdAsc(eventId);

        try (StringWriter sw = new StringWriter();
             CSVPrinter printer = new CSVPrinter(sw, CSVFormat.DEFAULT.builder().setHeader("Team Name", "Student Name", "Email", "QR_Token", "Status").build())) {
            for (TeamMember member : members) {
                printer.printRecord(
                    member.getTeam().getTeamName(),
                    member.getUser().getName(),
                    member.getUser().getEmail(),
                    member.getQrToken() != null ? member.getQrToken() : "PENDING_GENERATION",
                    member.getStatus().name()
                );
            }
            return sw.toString().getBytes("UTF-8");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating CSV");
        }
    }

    @Transactional(readOnly = true)
    public Event getEventForUpdate(Long eventId) {
        return eventRepository.findByIdForUpdate(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
    }

    private User requireOrganizer() {
        currentUserService.requireRole(UserRole.ORGANIZER);
        return currentUserService.getCurrentUser();
    }

    private void requireOwnership(User currentUser, Fest fest) {
        if (fest.getOwnedBy() == null || !fest.getOwnedBy().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the owning organizer can modify this event");
        }
    }

    private void validateEventTimeline(Fest fest, LocalDateTime registrationStart, LocalDateTime registrationEnd, LocalDateTime physicalStart, LocalDateTime physicalEnd) {
        if (registrationStart == null || registrationEnd == null || physicalStart == null || physicalEnd == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event timestamps are required");
        }
        if (!registrationStart.isBefore(registrationEnd)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration start must be before registration end");
        }
        if (!registrationEnd.isBefore(physicalStart)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration end must be before the physical event start");
        }
        if (!physicalStart.isBefore(physicalEnd)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Physical event start must be before physical event end");
        }
        if (physicalStart.isBefore(fest.getFestStartTime()) || physicalEnd.isAfter(fest.getFestEndTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Physical event timings must stay within the fest window");
        }
    }

    private void ensureExistingTeamsFit(Long eventId, int maxTeamSize) {
        teamRepository.findAllByEvent_IdOrderByIdAsc(eventId).forEach(team -> {
            long memberCount = teamMemberRepository.countByTeam_Id(team.getId());
            if (memberCount > maxTeamSize) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Existing teams exceed the new max team size");
            }
        });
    }

    private boolean canViewFest(User currentUser, Fest fest) {
        if (fest.getStatus() == FestStatus.PUBLISHED) {
            return true;
        }
        return currentUserService.isOrganizer(currentUser)
                && fest.getOwnedBy() != null
                && fest.getOwnedBy().getId().equals(currentUser.getId());
    }

    private LocalDateTime resolve(LocalDateTime requestValue, LocalDateTime fallback) {
        return requestValue != null ? requestValue : fallback;
    }

    private EventResponse toResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setName(event.getName());
        response.setDescription(event.getDescription());
        response.setVenue(event.getVenue());
        response.setEventBannerUrl(event.getEventBannerUrl());
        response.setMaxCapacity(event.getMaxCapacity());
        response.setCurrentBookings(event.getCurrentBookings());
        response.setMaxTeamSize(event.getMaxTeamSize());
        response.setRegistrationStart(event.getRegistrationStart());
        response.setRegistrationEnd(event.getRegistrationEnd());
        response.setPhysicalEventStart(event.getPhysicalEventStart());
        response.setPhysicalEventEnd(event.getPhysicalEventEnd());
        response.setFestId(event.getFest().getId());
        response.setFestName(event.getFest().getName());
        response.setFestStatus(event.getFest().getStatus());
        response.setFestType(event.getFest().getType());
        return response;
    }
}
