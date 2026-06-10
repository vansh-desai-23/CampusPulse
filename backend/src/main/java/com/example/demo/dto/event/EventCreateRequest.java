package com.example.demo.dto.event;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EventCreateRequest {

    @NotBlank
    private String name;

    private String description;

    @NotBlank
    private String venue;

    private String eventBannerUrl;


    @NotNull
    @Min(1)
    private Integer maxCapacity;

    @Min(1)
    private Integer maxTeamSize;

    @NotNull
    private LocalDateTime registrationStart;

    @NotNull
    private LocalDateTime registrationEnd;

    @NotNull
    private LocalDateTime physicalEventStart;

    @NotNull
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
