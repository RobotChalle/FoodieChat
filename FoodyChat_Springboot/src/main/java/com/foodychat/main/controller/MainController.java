package com.foodychat.main.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 사용자 관리 컨트롤러
 */
@RestController
@RequestMapping("/main")
public class MainController {
	@GetMapping("/message")
    public Map<String, String> getMessage() {
        return Map.of("text", "Hello from Spring Boot!");
    }
}