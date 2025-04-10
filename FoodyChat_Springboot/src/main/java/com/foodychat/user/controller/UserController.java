package com.foodychat.user.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.foodychat.user.service.UserService;
import com.foodychat.user.vo.GoogleUserInfo;
import com.foodychat.user.vo.UserDetailsVO;
import com.foodychat.user.vo.UserVO;
import com.foodychat.util.GoogleTokenVerifier;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    // 🟢 일반 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserVO loginRequest, HttpSession session) {
        System.out.println("로그인 요청: " + loginRequest.getUser_name());
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(loginRequest.getUser_name(), loginRequest.getUser_password());

        try {
            Authentication auth = authenticationManager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            return ResponseEntity.ok("로그인 성공");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }

    // 🟢 일반 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody UserVO userVO) {
        userService.registerUser(userVO);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "회원가입 성공");
        response.put("user_id", userVO.getUser_id());
        return ResponseEntity.ok(response);
    }

    // 🟢 구글 회원가입
    @PostMapping("/google")
    public ResponseEntity<?> googleSignup(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        GoogleUserInfo userInfo = GoogleTokenVerifier.verify(token);

        UserVO existingUser = userService.getUserByEmail(userInfo.getEmail());
        if (existingUser != null) {
            return ResponseEntity.ok(Map.of("user_id", existingUser.getUser_id()));
        }

        UserVO user = new UserVO();
        user.setEmail(userInfo.getEmail());
        user.setGoogle_id(userInfo.getGoogleId());
        user.setUser_name(userInfo.getName());
        user.setPhone("010-1234-5678");
        user.setMembership_lvl("regular");

        userService.registerGoogleUser(user);
        UserVO savedUser = userService.getUserByEmail(userInfo.getEmail());

        if (savedUser == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("유저 저장 후 조회 실패");
        }

        return ResponseEntity.ok(Map.of("user_id", savedUser.getUser_id()));
    }

    // 🟢 유저 상세정보 저장
    @PostMapping("/details")
    public ResponseEntity<?> saveUserDetails(@RequestBody UserDetailsVO details) {
        if (details.getUser_id() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("user_id 누락됨");
        }
        userService.saveUserDetails(details);
        return ResponseEntity.ok("추가 정보 저장 성공");
    }

    // 🟡 관리자용 유저 목록
    @GetMapping("/admin/users")
    public ResponseEntity<?> getUserList(
        @RequestParam(name = "page", defaultValue = "1") int page,
        @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        List<UserVO> users = userService.getUserList(page, size);
        int total = userService.getTotalUserCount();

        Map<String, Object> result = new HashMap<>();
        result.put("users", users);
        result.put("total", total);
        return ResponseEntity.ok(result);
    }

    // 🟡 관리자용 유저 삭제
    @DeleteMapping("/admin/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("삭제 성공");
    }
    // 🟡 관리자용 유저 등급 변경
    @PatchMapping("/users/admin/users/{userId}/membership")
    public ResponseEntity<?> updateMembershipLevel(
        @PathVariable Long userId,
        @RequestBody Map<String, String> request
    ) {
        String newLevel = request.get("membershipLevel"); // <- key 이름 정확히!
        userService.updateMembershipLevel(userId, newLevel);
        return ResponseEntity.ok().build();
    }
}
