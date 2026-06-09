package com.example.demo.model.fest;

import com.example.demo.model.User;
import com.example.demo.model.event.Event;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "fests")
public class Fest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FestType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FestStatus status = FestStatus.DRAFT;

    @Column(name = "banner_image_url")
    private String bannerImageUrl;

    @Column(name = "logo_image_url")
    private String logoImageUrl;

    @Column(nullable = false)
    private LocalDateTime festStartTime;

    @Column(nullable = false)
    private LocalDateTime festEndTime;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owned_by", nullable = false)
    private User ownedBy;

    @OneToMany(mappedBy = "fest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Event> events = new ArrayList<>();

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

    public String getLogoImageUrl() {
        return logoImageUrl;
    }

    public void setLogoImageUrl(String logoImageUrl) {
        this.logoImageUrl = logoImageUrl;
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

    public User getOwnedBy() {
        return ownedBy;
    }

    public void setOwnedBy(User ownedBy) {
        this.ownedBy = ownedBy;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }
}
