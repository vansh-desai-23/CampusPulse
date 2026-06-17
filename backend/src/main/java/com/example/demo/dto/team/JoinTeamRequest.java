package com.example.demo.dto.team;

import jakarta.validation.constraints.NotBlank;

public class JoinTeamRequest {

    @NotBlank
    private String inviteCode;

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }
}

