package com.example.demo.dto;

public class AuthResponse {

    private final String token;
    private final String tokenType;
    private final Long userId;
    private final String email;
    private final String name;
    private final UserRole role;
    private final String status;

    public AuthResponse(String token, Long userId, String email, String name, UserRole role, String status) {
        this.token = token;
        this.tokenType = "Bearer";
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.role = role;
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public UserRole getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }
}
