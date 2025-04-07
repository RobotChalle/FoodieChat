package com.foodychat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class GlobalCorsConfig {
	@Bean
	public WebMvcConfigurer corsConfigurer() {
	    return new WebMvcConfigurer() {
	        @Override
	        public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
	            registry.addMapping("/**")
	                    .allowedOrigins("http://localhost:3000")
	                    .allowedMethods("GET", "POST", "PUT", "DELETE")
	                    .allowCredentials(true); // 세션 공유용
	        }
	    };
	}
}
