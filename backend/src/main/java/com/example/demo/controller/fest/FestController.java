package com.example.demo.controller.fest;

import com.example.demo.dto.fest.FestCreateRequest;
import com.example.demo.dto.fest.FestResponse;
import com.example.demo.dto.fest.FestUpdateRequest;
import com.example.demo.service.fest.FestService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fests")
public class FestController {

    private final FestService festService;

    public FestController(FestService festService) {
        this.festService = festService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<FestResponse> createFest(@Valid @RequestBody FestCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(festService.createFest(request));
    }

    @GetMapping("/published")
    public ResponseEntity<List<FestResponse>> listPublishedFests() {
        return ResponseEntity.ok(festService.listPublishedFests());
    }

    @GetMapping("/published/recent")
    public ResponseEntity<List<FestResponse>> listRecentlyPublishedFests() {
        return ResponseEntity.ok(festService.listRecentlyPublishedFests());
    }

    @GetMapping("/my-fests")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<FestResponse>> listMyFests() {
        return ResponseEntity.ok(festService.listMyFests());
    }

    @GetMapping("/{festId}")
    public ResponseEntity<FestResponse> getFest(@PathVariable Long festId) {
        return ResponseEntity.ok(festService.getFest(festId));
    }

    @PutMapping("/{festId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<FestResponse> updateFest(
            @PathVariable Long festId,
            @RequestBody FestUpdateRequest request) {
        return ResponseEntity.ok(festService.updateFest(festId, request));
    }

    @PatchMapping("/{festId}/publish")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<FestResponse> publishFest(@PathVariable Long festId) {
        return ResponseEntity.ok(festService.publishFest(festId));
    }
}

