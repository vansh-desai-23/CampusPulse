package com.example.demo.dto.event;

import com.example.demo.model.fest.FestStatus;
import com.example.demo.model.fest.FestType;
import java.time.LocalDateTime;

public class EventResponse {

    private Long id;
    private String name;
    private String description;
    private String venue;
    private String eventBannerUrl;
    private String eventLogoUrl;
    private int maxCapacity;
    private int currentBookings;
    private int maxTeamSize;
    private LocalDateTime registrationStart;
    private LocalDateTime registrationEnd;
    private LocalDateTime physicalEventStart;
    private LocalDateTime physicalEventEnd;
    private Long festId;
    private String festName;
    private FestStatus festStatus;
    private FestType festType;

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

    public String getEventLogoUrl() {
        return eventLogoUrl;
    }

    public void setEventLogoUrl(String eventLogoUrl) {
        this.eventLogoUrl = eventLogoUrl;
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

    public Long getFestId() {
        return festId;
    }

    public void setFestId(Long festId) {
        this.festId = festId;
    }

    public String getFestName() {
        return festName;
    }

    public void setFestName(String festName) {
        this.festName = festName;
    }

    public FestStatus getFestStatus() {
        return festStatus;
    }

    public void setFestStatus(FestStatus festStatus) {
        this.festStatus = festStatus;
    }

    public FestType getFestType() {
        return festType;
    }

    public void setFestType(FestType festType) {
        this.festType = festType;
    }
}
