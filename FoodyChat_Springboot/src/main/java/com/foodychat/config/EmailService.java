package com.foodychat.config;

public interface EmailService {
	void sendEmail(String to, String subject, String content);
}
