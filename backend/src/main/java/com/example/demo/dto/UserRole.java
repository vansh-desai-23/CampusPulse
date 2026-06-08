package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserRole {
    STUDENT,
    ORGANIZER;

    @JsonCreator
    public static UserRole fromValue(String value) {
        if (value == null) {
            return null;
        }
        return UserRole.valueOf(value.trim().toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return name();
    }
}
