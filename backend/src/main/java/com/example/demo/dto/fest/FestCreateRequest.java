package com.example.demo.dto.fest;

import com.example.demo.model.fest.FestType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class FestCreateRequest {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private FestType type;

    private String bannerImageUrl;


    @NotNull
    private LocalDateTime festStartTime;

    @NotNull
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

