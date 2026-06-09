package com.example.demo.controller.event;

import com.example.demo.dto.event.EventCreateRequest;
import com.example.demo.dto.event.EventResponse;
import com.example.demo.dto.event.EventUpdateRequest;
import com.example.demo.service.event.EventService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping("/fests/{festId}/events")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponse> createEvent(
            @PathVariable Long festId,
            @Valid @RequestBody EventCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(festId, request));
    }

    @GetMapping("/fests/{festId}/events")
    public ResponseEntity<List<EventResponse>> listEventsByFest(@PathVariable Long festId) {
        return ResponseEntity.ok(eventService.listEventsByFest(festId));
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventService.getEvent(eventId));
    }

    @PutMapping("/events/{eventId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long eventId,
            @RequestBody EventUpdateRequest request) {
        return ResponseEntity.ok(eventService.updateEvent(eventId, request));
    }

    @GetMapping("/events/{eventId}/roster/export")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<byte[]> exportRoster(@PathVariable Long eventId) {
        byte[] csvData = eventService.exportRoster(eventId);
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=roster_event_" + eventId + ".csv");
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        return new ResponseEntity<>(csvData, headers, HttpStatus.OK);
    }
}
