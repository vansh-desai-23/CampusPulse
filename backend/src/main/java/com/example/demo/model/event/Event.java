package com.example.demo.model.event;

import com.example.demo.model.fest.Fest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(nullable = false)
    private String venue;

    @Column(name = "event_banner_url")
    private String eventBannerUrl;



    @Column(nullable = false)
    private int maxCapacity;

    @Column(nullable = false)
    private int currentBookings = 0;

    @Column(nullable = false)
    private int maxTeamSize = 1;

    @Column(nullable = false)
    private LocalDateTime registrationStart;

    @Column(nullable = false)
    private LocalDateTime registrationEnd;

    @Column(nullable = false)
    private LocalDateTime physicalEventStart;

    @Column(nullable = false)
    private LocalDateTime physicalEventEnd;

    @Column(nullable = false)
    private boolean ticketsGenerated = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fest_id", nullable = false)
    private Fest fest;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getEventBannerUrl() {
        return eventBannerUrl;
    }

    public void setEventBannerUrl(String eventBannerUrl) {
        this.eventBannerUrl = eventBannerUrl;
    }


    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public int getCurrentBookings() {
        return currentBookings;
    }

    public void setCurrentBookings(int currentBookings) {
        this.currentBookings = currentBookings;
    }

    public int getMaxTeamSize() {
        return maxTeamSize;
    }

    public void setMaxTeamSize(int maxTeamSize) {
        this.maxTeamSize = maxTeamSize;
    }

    public LocalDateTime getRegistrationStart() {
        return registrationStart;
    }

    public void setRegistrationStart(LocalDateTime registrationStart) {
        this.registrationStart = registrationStart;
    }

    public LocalDateTime getRegistrationEnd() {
        return registrationEnd;
    }

    public void setRegistrationEnd(LocalDateTime registrationEnd) {
        this.registrationEnd = registrationEnd;
    }

    public LocalDateTime getPhysicalEventStart() {
        return physicalEventStart;
    }

    public void setPhysicalEventStart(LocalDateTime physicalEventStart) {
        this.physicalEventStart = physicalEventStart;
    }

    public LocalDateTime getPhysicalEventEnd() {
        return physicalEventEnd;
    }

    public void setPhysicalEventEnd(LocalDateTime physicalEventEnd) {
        this.physicalEventEnd = physicalEventEnd;
    }

    public boolean isTicketsGenerated() {
        return ticketsGenerated;
    }

    public void setTicketsGenerated(boolean ticketsGenerated) {
        this.ticketsGenerated = ticketsGenerated;
    }

    public Fest getFest() {
        return fest;
    }

    public void setFest(Fest fest) {
        this.fest = fest;
    }
}

