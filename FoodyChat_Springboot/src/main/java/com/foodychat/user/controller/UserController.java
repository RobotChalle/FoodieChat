package com.foodychat.user.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.foodychat.user.service.UserService;
import com.foodychat.user.vo.UserVO;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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

    @PostMapping("/loginUser")
    public ResponseEntity<?> loginUser(@RequestParam("email") String email,
    	    					   	   @RequestParam("user_password") String user_password,
    	    					   	   HttpServletResponse response,
    	    					   	   HttpSession session) {
    	System.out.println("로그인 요청: " + email);
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(email, user_password);
        System.out.println(token);
        try {
        	Authentication auth = authenticationManager.authenticate(token);
        	System.out.println(auth);
            SecurityContextHolder.getContext().setAuthentication(auth);
            System.out.println(SecurityContextHolder.getContext());
            // 세션에 SecurityContext 저장
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            System.out.println(session);
            // 예시: 유저 정보 조회
            UserVO user = userService.getUserByEmail(email);
            System.out.println(user);

            // HttpOnly 쿠키 생성
            Cookie sessionCookie = new Cookie("SESSIONID", session.getId());
            sessionCookie.setHttpOnly(true);
            sessionCookie.setSecure(true); // HTTPS에서만 전송 (테스트 시 false 가능)
            sessionCookie.setPath("/");
            sessionCookie.setMaxAge(60 * 60 * 24); // 하루 유지
            response.addCookie(sessionCookie);

            // 로그인 성공 + 유저 정보 반환
            return ResponseEntity.ok(user);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }
    
    @PostMapping("/myPage")
    public ResponseEntity<?> mypage(@RequestBody UserVO userVO, HttpSession session) {
    	userVO.setUser_id(1);
    	UserVO vo = userService.getUserById(userVO.getUser_id());
    	// 필요한 정보만 추출해서 전송 (보안 고려)
        Map<String, Object> data = new HashMap<>();
        data.put("user_name", vo.getUser_name());
        data.put("user_id", vo.getUser_id());
        data.put("email", vo.getEmail());
        data.put("phone", vo.getPhone());
        data.put("membership_lvl", vo.getMembership_lvl());
        data.put("gender", vo.getGender());
        data.put("height", vo.getHeight());
        data.put("user_weight", vo.getUser_weight());
        data.put("user_address", vo.getUser_address());
        data.put("reg_date", vo.getReg_date());
        data.put("upd_date", vo.getUpd_date());

        return ResponseEntity.ok(data);
    }
    
    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestParam("currentPassword") String currentPassword,
								    	    @RequestParam("newPassword") String newPassword) {
    	UserVO userVO = new UserVO();
    	userVO.setEmail("admin@gmail.com");
        String userEmail = userVO.getEmail(); // 로그인된 사용자
        boolean success = userService.changePassword(userEmail, currentPassword, newPassword);
        if (success) {
            return ResponseEntity.ok("비밀번호 변경 성공");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호 변경 실패");
        }
    }
}