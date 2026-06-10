package com.example.demo.dto.team;

import com.example.demo.model.team.TeamMemberStatus;
import java.util.List;

public class TeamResponse {

    private Long id;
    private String teamName;
    private String inviteCode;
    private Long eventId;
    private String eventName;
    private Long festId;
    private String festName;
    private Long leaderId;
    private String leaderName;
    private String leaderEmail;
    private int memberCount;
    private int maxTeamSize;
    private int eventCurrentBookings;
    private int eventMaxCapacity;
    private java.time.LocalDateTime registrationEnd;
    private String eventBannerUrl;
    private List<TeamMemberView> members;

    public String getEventBannerUrl() {
        return eventBannerUrl;
    }

    public void setEventBannerUrl(String eventBannerUrl) {
        this.eventBannerUrl = eventBannerUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
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

    public Long getLeaderId() {
        return leaderId;
    }

    public void setLeaderId(Long leaderId) {
        this.leaderId = leaderId;
    }

    public String getLeaderName() {
        return leaderName;
    }

    public void setLeaderName(String leaderName) {
        this.leaderName = leaderName;
    }

    public String getLeaderEmail() {
        return leaderEmail;
    }

    public void setLeaderEmail(String leaderEmail) {
        this.leaderEmail = leaderEmail;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }

    public int getMaxTeamSize() {
        return maxTeamSize;
    }

    public void setMaxTeamSize(int maxTeamSize) {
        this.maxTeamSize = maxTeamSize;
    }

    public int getEventCurrentBookings() {
        return eventCurrentBookings;
    }

    public void setEventCurrentBookings(int eventCurrentBookings) {
        this.eventCurrentBookings = eventCurrentBookings;
    }

    public int getEventMaxCapacity() {
        return eventMaxCapacity;
    }

    public void setEventMaxCapacity(int eventMaxCapacity) {
        this.eventMaxCapacity = eventMaxCapacity;
    }

    public java.time.LocalDateTime getRegistrationEnd() {
        return registrationEnd;
    }

    public void setRegistrationEnd(java.time.LocalDateTime registrationEnd) {
        this.registrationEnd = registrationEnd;
    }

    public List<TeamMemberView> getMembers() {
        return members;
    }

    public void setMembers(List<TeamMemberView> members) {
        this.members = members;
    }

    public static class TeamMemberView {
        private Long userId;
        private String name;
        private String email;
        private TeamMemberStatus status;
        private String qrToken;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public TeamMemberStatus getStatus() {
            return status;
        }

        public void setStatus(TeamMemberStatus status) {
            this.status = status;
        }

        public String getQrToken() {
            return qrToken;
        }

        public void setQrToken(String qrToken) {
            this.qrToken = qrToken;
        }
    }
}
