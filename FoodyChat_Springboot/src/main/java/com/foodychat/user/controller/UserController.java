package com.foodychat.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodychat.user.service.UserService;
import com.foodychat.user.vo.UserVO;

import jakarta.servlet.http.HttpSession;

/**
 * 사용자 관리 컨트롤러
 */
@RestController
@RequestMapping("/users")
public class UserController {
	@Autowired
    UserService userService;
	
	@Autowired
    private AuthenticationManager authenticationManager;
	
	/**
     * 특정 사용자 정보 조회
     */
    @GetMapping("/{id}")
    public String getUserById(@PathVariable int id, Model model) {
        UserVO user = userService.getUserById(id);
        model.addAttribute("user", user);
        return "user/userDetail"; 	//userDetail.html 또는 userDetail.jsp 페이지로 이동
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserVO loginRequest, HttpSession session) {
    	System.out.println("로그인 요청: " + loginRequest.getUser_name());
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(loginRequest.getUser_name(), loginRequest.getUser_password());
        System.out.println(token);
        try {
            Authentication auth = authenticationManager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            return ResponseEntity.ok("로그인 성공");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }
}