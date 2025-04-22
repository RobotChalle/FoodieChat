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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

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
                    "/users/resetPassword",
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
                    "/users/details",
                    "/users/*/details",
                    "/users/*/bmi",
                    "/users/*/meals",
                    "/chat/**",
                    "/analyze/foods/translations",
                    "/analyze/food",
                    "/analyze/store",
                    "/analyze/upload"
                ).hasAnyRole("REGULAR", "BUSINESS", "ADMIN")
                .requestMatchers(
                    "/users/meals",
                    "/analyze/recommend"
                ).hasAnyRole("BUSINESS", "ADMIN")
                .requestMatchers("/users/admin/users/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .securityContext(context -> context.requireExplicitSave(false))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .formLogin(form -> form
                .loginProcessingUrl("/users/loginUser")
                .usernameParameter("email")
                .passwordParameter("user_password")
                .defaultSuccessUrl("/users/ses", true)
                .permitAll()
            )
            .logout().disable();

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
    	log.info("🌐 [CORS Config] React URL: {}", reactUrl);
        log.info("🌐 [CORS Config] Server URL: {}", serverUrl);
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(reactUrl, serverUrl)); // ✅ 혹시 여기에서 포트 포함되어 있나? 예: http://localhost:3000
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*")); // ✅ 이걸로 확장 필요함
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