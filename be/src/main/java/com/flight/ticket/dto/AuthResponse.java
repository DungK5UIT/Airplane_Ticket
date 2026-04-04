package com.flight.ticket.dto;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String message;
    private String role;
    @JsonProperty("maNguoiDung")
    private Integer maNguoiDung;
}
