package com.example.demo.dto.fest;

import com.example.demo.model.fest.FestStatus;
import com.example.demo.model.fest.FestType;
import java.time.LocalDateTime;

public class FestUpdateRequest {

    private String name;
    private String description;
    private FestType type;
    private FestStatus status;
    private String bannerImageUrl;
    private LocalDateTime festStartTime;
    private LocalDateTime festEndTime;

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
}
