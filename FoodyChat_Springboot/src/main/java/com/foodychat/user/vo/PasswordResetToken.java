package com.foodychat.config;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {
	private Long id;
    private String token;
    private String email;
    private LocalDateTime expiryDate;
    private Long userId;
}