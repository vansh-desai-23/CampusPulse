package com.example.demo.dto.fest;

import com.example.demo.dto.event.EventResponse;
import com.example.demo.model.fest.FestStatus;
import com.example.demo.model.fest.FestType;
import java.time.LocalDateTime;
import java.util.List;

public class FestResponse {

    private Long id;
    private String name;
    private String description;
    private FestType type;
    private FestStatus status;
    private String bannerImageUrl;
    private LocalDateTime festStartTime;
    private LocalDateTime festEndTime;
    private LocalDateTime createdAt;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private List<EventResponse> events;

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

    public FestType getType() {
        return type;
    }

    public void setType(FestType type) {
        this.type = type;
    }

    public FestStatus getStatus() {
        return status;
    }

    public void setStatus(FestStatus status) {
        this.status = status;
    }

    public String getBannerImageUrl() {
        return bannerImageUrl;
    }

    public void setBannerImageUrl(String bannerImageUrl) {
        this.bannerImageUrl = bannerImageUrl;
    }


    public LocalDateTime getFestStartTime() {
        return festStartTime;
    }

    public void setFestStartTime(LocalDateTime festStartTime) {
        this.festStartTime = festStartTime;
    }

    public LocalDateTime getFestEndTime() {
        return festEndTime;
    }

    public void setFestEndTime(LocalDateTime festEndTime) {
        this.festEndTime = festEndTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public List<EventResponse> getEvents() {
        return events;
    }

    public void setEvents(List<EventResponse> events) {
        this.events = events;
    }
}
