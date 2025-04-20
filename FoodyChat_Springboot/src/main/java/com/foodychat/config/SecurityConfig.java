package com.foodychat.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.foodychat.user.service.CustomUserDetailsService;

import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${react.url}")
    private String reactUrl;

    @Value("${server.url}")
    private String serverUrl;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",
                    "/users/loginUser",
                    "/users/googleLogin",
                    "/users/findId",
                    "/users/findPassword",
                    "/users/signup",
                    "/users/google",
                    "/users/ses",
                    "/users/user-id",
                    "/users/logout",
                    "/index.html",
                    "/static/**",
                    "/favicon.ico",
                    "/error"
                ).permitAll()
                .requestMatchers(
                    "/users/myPage",
                    "/users/changePassword",
                    "/users/updateUser",
                    "/users/resetPassword",
                    "/users/details",
                    "/users/*/details",
                    "/users/*/bmi",
                    "/users/*/meals",
                    "/chat/**",
                    "/analyze/foods/translations",
                    "/analyze/food",
                    "/analyze/store",
                    "/analyze/upload"
                ).hasAnyRole("regular", "business", "admin")
                .requestMatchers(
                    "/users/meals",
                    "/analyze/recommend"
                ).hasAnyRole("business", "admin")
                .requestMatchers("/users/admin/users/**").hasRole("admin")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .formLogin().disable()
            .logout(logout -> logout.invalidateHttpSession(true).deleteCookies("JSESSIONID"));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(reactUrl, serverUrl));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type", "Authorization", "Accept"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Ensure SecurityContext persists across sessions
    @Bean
    public HttpSessionListener httpSessionListener() {
        return new HttpSessionListener() {
            @Override
            public void sessionCreated(HttpSessionEvent se) {
                // No-op
            }

            @Override
            public void sessionDestroyed(HttpSessionEvent se) {
                SecurityContextHolder.clearContext();
            }
        };
    }
}