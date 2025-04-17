package com.foodychat.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())  // CSRF 비활성화
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))  // CORS 설정
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/users/**", 
                        "/loginUser", 
                        "/users/admin/**", 
                        "/", 
                        "/index.html", 
                        "/static/**", 
                        "/favicon.ico", 
                        "/ses/**", 
                        "/chat/**", 
                        "/api/**", 
                        "/user-id", 
                        "/users/*/details", 
                        "/users/*/bmi", 
                        "/users/*/meals", 
                        "/error"
                ).permitAll()  // 위 URL은 모두 허용
                .anyRequest().authenticated()  // 나머지 요청은 인증된 사용자만 허용
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))  // 세션 필요 시 생성
            .formLogin().disable()  // form login 비활성화
            .headers(headers -> headers
                .addHeaderWriter(new StaticHeadersWriter(
                    "Cross-Origin-Opener-Policy", "same-origin"))
                .addHeaderWriter(new StaticHeadersWriter(
                    "Cross-Origin-Embedder-Policy", "require-corp"))
            );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000"));  // 허용할 Origin 설정
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));  // 허용할 HTTP 메서드 설정
        config.setAllowedHeaders(List.of("Content-Type", "Authorization", "Accept"));  // 허용할 헤더 설정
        config.setAllowCredentials(true);  // 자격 증명 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);  // 모든 경로에 CORS 설정 적용
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // 패스워드 암호화 방식
    }
}
