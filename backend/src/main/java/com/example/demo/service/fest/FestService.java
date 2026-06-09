package com.example.demo.service.fest;

import com.example.demo.dto.UserRole;
import com.example.demo.dto.event.EventResponse;
import com.example.demo.dto.fest.FestCreateRequest;
import com.example.demo.dto.fest.FestResponse;
import com.example.demo.dto.fest.FestUpdateRequest;
import com.example.demo.model.User;
import com.example.demo.model.event.Event;
import com.example.demo.model.fest.Fest;
import com.example.demo.model.fest.FestStatus;
import com.example.demo.repository.event.EventRepository;
import com.example.demo.repository.fest.FestRepository;
import com.example.demo.service.security.CurrentUserService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FestService {

    private final FestRepository festRepository;
    private final EventRepository eventRepository;
    private final CurrentUserService currentUserService;

    public FestService(
            FestRepository festRepository,
            EventRepository eventRepository,
            CurrentUserService currentUserService) {
        this.festRepository = festRepository;
        this.eventRepository = eventRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public FestResponse createFest(FestCreateRequest request) {
        currentUserService.requireRole(UserRole.ORGANIZER);
        User currentUser = currentUserService.getCurrentUser();

        validateChronology(request.getFestStartTime(), request.getFestEndTime(), "Fest start time must be before fest end time");

        Fest fest = new Fest();
        fest.setName(request.getName().trim());
        fest.setDescription(request.getDescription());
        fest.setType(request.getType());
        fest.setBannerImageUrl(request.getBannerImageUrl());
        fest.setLogoImageUrl(request.getLogoImageUrl());
        fest.setFestStartTime(request.getFestStartTime());
        fest.setFestEndTime(request.getFestEndTime());
        fest.setOwnedBy(currentUser);
        fest.setStatus(FestStatus.DRAFT);

        return toResponse(festRepository.save(fest));
    }

    @Transactional(readOnly = true)
    public List<FestResponse> listPublishedFests() {
        return festRepository.findAllByStatusOrderByFestStartTimeAsc(FestStatus.PUBLISHED).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FestResponse> listRecentlyPublishedFests() {
        return festRepository.findTop4ByStatusOrderByCreatedAtDescIdDesc(FestStatus.PUBLISHED).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FestResponse> listMyFests() {
        currentUserService.requireRole(UserRole.ORGANIZER);
        User currentUser = currentUserService.getCurrentUser();
        return festRepository.findAllByOwnedByIdOrderByCreatedAtDesc(currentUser.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FestResponse getFest(Long festId) {
        Fest fest = festRepository.findById(festId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fest not found"));
        User currentUser = currentUserService.getCurrentUser();
        if (!canViewFest(currentUser, fest)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fest not found");
        }
        return toResponse(fest);
    }

    @Transactional
    public FestResponse updateFest(Long festId, FestUpdateRequest request) {
        currentUserService.requireRole(UserRole.ORGANIZER);
        User currentUser = currentUserService.getCurrentUser();
        Fest fest = festRepository.findByIdForUpdate(festId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fest not found"));
        requireOwnership(currentUser, fest);

        LocalDateTimePair pair = resolveFestTimes(fest, request);
        validateChronology(pair.start(), pair.end(), "Fest start time must be before fest end time");

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            fest.setName(request.getName().trim());
        }
        if (request.getDescription() != null) {
            fest.setDescription(request.getDescription());
        }
        if (request.getType() != null) {
            fest.setType(request.getType());
        }
        if (request.getStatus() != null) {
            if (request.getStatus() == FestStatus.PUBLISHED) {
                validateExistingEventsStillFit(fest, pair.start(), pair.end());
            }
            fest.setStatus(request.getStatus());
        }
        if (request.getBannerImageUrl() != null) {
            fest.setBannerImageUrl(request.getBannerImageUrl());
        }
        if (request.getLogoImageUrl() != null) {
            fest.setLogoImageUrl(request.getLogoImageUrl());
        }
        fest.setFestStartTime(pair.start());
        fest.setFestEndTime(pair.end());

        validateExistingEventsStillFit(fest, pair.start(), pair.end());
        return toResponse(fest);
    }

    @Transactional
    public FestResponse publishFest(Long festId) {
        currentUserService.requireRole(UserRole.ORGANIZER);
        User currentUser = currentUserService.getCurrentUser();
        Fest fest = festRepository.findByIdForUpdate(festId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fest not found"));
        requireOwnership(currentUser, fest);
        validateExistingEventsStillFit(fest, fest.getFestStartTime(), fest.getFestEndTime());
        fest.setStatus(FestStatus.PUBLISHED);
        return toResponse(fest);
    }

    private boolean canViewFest(User currentUser, Fest fest) {
        if (fest.getStatus() == FestStatus.PUBLISHED) {
            return true;
        }
        return currentUserService.isOrganizer(currentUser)
                && fest.getOwnedBy() != null
                && fest.getOwnedBy().getId().equals(currentUser.getId());
    }

    private void requireOwnership(User currentUser, Fest fest) {
        if (fest.getOwnedBy() == null || !fest.getOwnedBy().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the owning organizer can modify this fest");
        }
    }

    private void validateExistingEventsStillFit(Fest fest, java.time.LocalDateTime newStart, java.time.LocalDateTime newEnd) {
        List<Event> events = eventRepository.findAllByFest_IdOrderByPhysicalEventStartAsc(fest.getId());
        for (Event event : events) {
            if (event.getPhysicalEventStart().isBefore(newStart) || event.getPhysicalEventEnd().isAfter(newEnd)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Existing events no longer fit inside the fest window");
            }
        }
    }

    private LocalDateTimePair resolveFestTimes(Fest fest, FestUpdateRequest request) {
        java.time.LocalDateTime start = request.getFestStartTime() != null ? request.getFestStartTime() : fest.getFestStartTime();
        java.time.LocalDateTime end = request.getFestEndTime() != null ? request.getFestEndTime() : fest.getFestEndTime();
        return new LocalDateTimePair(start, end);
    }

    private void validateChronology(java.time.LocalDateTime start, java.time.LocalDateTime end, String message) {
        if (start == null || end == null || !start.isBefore(end)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }

    private FestResponse toResponse(Fest fest) {
        FestResponse response = new FestResponse();
        response.setId(fest.getId());
        response.setName(fest.getName());
        response.setDescription(fest.getDescription());
        response.setType(fest.getType());
        response.setStatus(fest.getStatus());
        response.setBannerImageUrl(fest.getBannerImageUrl());
        response.setLogoImageUrl(fest.getLogoImageUrl());
        response.setFestStartTime(fest.getFestStartTime());
        response.setFestEndTime(fest.getFestEndTime());
        response.setCreatedAt(fest.getCreatedAt());
        response.setOwnerId(fest.getOwnedBy() == null ? null : fest.getOwnedBy().getId());
        response.setOwnerName(fest.getOwnedBy() == null ? null : fest.getOwnedBy().getName());
        response.setOwnerEmail(fest.getOwnedBy() == null ? null : fest.getOwnedBy().getEmail());
        response.setEvents(eventRepository.findAllByFest_IdOrderByPhysicalEventStartAsc(fest.getId()).stream()
                .map(this::toEventResponse)
                .toList());
        return response;
    }

    private EventResponse toEventResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setName(event.getName());
        response.setDescription(event.getDescription());
        response.setVenue(event.getVenue());
        response.setEventBannerUrl(event.getEventBannerUrl());
        response.setEventLogoUrl(event.getEventLogoUrl());
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

    private record LocalDateTimePair(java.time.LocalDateTime start, java.time.LocalDateTime end) {
    }
}
