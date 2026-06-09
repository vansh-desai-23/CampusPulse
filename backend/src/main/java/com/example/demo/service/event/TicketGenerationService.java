package com.example.demo.service.event;

import com.example.demo.model.event.Event;
import com.example.demo.model.team.TeamMember;
import com.example.demo.model.team.TeamMemberStatus;
import com.example.demo.repository.event.EventRepository;
import com.example.demo.repository.team.TeamMemberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class TicketGenerationService {

    private final EventRepository eventRepository;
    private final TeamMemberRepository teamMemberRepository;

    @Value("${app.qr.secret:default-secret-key-12345}")
    private String qrSecretKey;

    public TicketGenerationService(EventRepository eventRepository, TeamMemberRepository teamMemberRepository) {
        this.eventRepository = eventRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    @Scheduled(fixedRate = 1800000) // 30 minutes
    @Transactional
    public void generateTickets() {
        List<Event> eventsToProcess = eventRepository.findAllByRegistrationEndBeforeAndTicketsGeneratedFalse(LocalDateTime.now());
        
        for (Event event : eventsToProcess) {
            List<TeamMember> confirmedMembers = teamMemberRepository.findAllByTeam_Event_IdAndStatus(event.getId(), TeamMemberStatus.CONFIRMED);
            
            for (TeamMember member : confirmedMembers) {
                String rawToken = String.format("%d-%d-%s-%s", 
                    event.getId(), 
                    member.getTeam().getId(), 
                    member.getUser().getEmail(), 
                    qrSecretKey);
                
                member.setQrToken(hashToken(rawToken));
                teamMemberRepository.save(member);
            }
            
            event.setTicketsGenerated(true);
            eventRepository.save(event);
        }
    }

    private String hashToken(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }
}
