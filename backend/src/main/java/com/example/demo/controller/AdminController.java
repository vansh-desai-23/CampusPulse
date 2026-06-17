package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.UserStatus;
import com.example.demo.dto.UserRole;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.fest.FestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final FestRepository festRepository;

    public AdminController(UserRepository userRepository, FestRepository festRepository) {
        this.userRepository = userRepository;
        this.festRepository = festRepository;
    }

    @GetMapping("/users/pending")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getPendingOrganizers() {
        List<User> pending = userRepository.findByRoleAndStatus(UserRole.ORGANIZER.name(), UserStatus.PENDING_APPROVAL);
        List<Map<String, Object>> response = pending.stream().map(u -> Map.of(
            "id", (Object)u.getId(),
            "name", u.getName(),
            "email", u.getEmail()
        )).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/active-organizers")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getActiveOrganizers() {
        List<User> active = userRepository.findByRoleAndStatus(UserRole.ORGANIZER.name(), UserStatus.ACTIVE);
        List<Map<String, Object>> response = active.stream().map(u -> Map.of(
            "id", (Object)u.getId(),
            "name", u.getName(),
            "email", u.getEmail()
        )).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/users/{userId}/approve")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> approveUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        return ResponseEntity.ok().body(Map.of("message", "User approved successfully"));
    }

    @PatchMapping("/users/{userId}/deregister")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deregisterUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!user.getRole().equalsIgnoreCase(UserRole.ORGANIZER.name())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can only deregister organizers");
        }

        boolean hasActiveFests = festRepository.existsByOwnedByIdAndFestEndTimeAfter(userId, LocalDateTime.now());
        if (hasActiveFests) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot deregister organizer with active fests");
        }

        user.setStatus(UserStatus.REJECTED);
        userRepository.save(user);

        return ResponseEntity.ok().body(Map.of("message", "Organizer deregistered successfully"));
    }
}

