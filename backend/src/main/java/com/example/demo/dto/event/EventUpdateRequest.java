package com.example.demo.dto.event;

import java.time.LocalDateTime;

public class EventUpdateRequest {

    private String name;
    private String description;
    private String venue;
    private String eventBannerUrl;
    private Integer maxCapacity;
    private Integer maxTeamSize;
    private LocalDateTime registrationStart;
    private LocalDateTime registrationEnd;
    private LocalDateTime physicalEventStart;
    private LocalDateTime physicalEventEnd;

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


    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public Integer getMaxTeamSize() {
        return maxTeamSize;
    }

    public void setMaxTeamSize(Integer maxTeamSize) {
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
}
