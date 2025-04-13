package com.foodychat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class GlobalCorsConfig {
	@Bean
	public WebMvcConfigurer corsConfigurer() {
	    return new WebMvcConfigurer() {
			/*
			 * @Override public void addCorsMappings(CorsRegistry registry) {
			 * registry.addMapping("/**") .allowedOrigins("http://localhost:8080")
			 * .allowedMethods("GET", "POST", "PUT", "DELETE") .allowCredentials(true); }
			 */
			// 개발시 위에 주석하고 밑에 소스 사용
			@Override public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) { 
				registry.addMapping("/**").allowedOrigins("http://localhost:3000").allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") .allowCredentials(true); // 세션 공유용 
			}
	    };
	}
}
