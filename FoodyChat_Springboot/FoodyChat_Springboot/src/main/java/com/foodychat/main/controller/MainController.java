package com.foodychat.main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodychat.user.service.UserService;

/**
 * 사용자 관리 컨트롤러
 */
@RestController
@RequestMapping("/users")
public class MainController {
	@Autowired
    UserService userService;
}