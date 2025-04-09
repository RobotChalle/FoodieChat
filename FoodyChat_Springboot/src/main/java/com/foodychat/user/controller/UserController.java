package com.foodychat.user.controller;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.foodychat.config.GoogleTokenVerifier;
import com.foodychat.user.service.UserService;
import com.foodychat.user.vo.GoogleUserInfo;
import com.foodychat.user.vo.UserLogVO;
import com.foodychat.user.vo.UserVO;

import jakarta.servlet.http.HttpServletRequest;
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
	PasswordEncoder passwordEncoder;

    @PostMapping("/loginUser")
    public ResponseEntity<?> loginUser(@RequestParam("email") String email,
    	    					   	   @RequestParam("user_password") String user_password,
    	    					   	   HttpServletResponse response,
    	    					   	   HttpServletRequest request,
    	    					   	   HttpSession session) {
        // 1. 사용자 조회
    	UserVO vo = userService.getUserByEmail(email);
    	
    	UserLogVO log = new UserLogVO();
        log.setIpAddress(request.getRemoteAddr());
        log.setUserAgent(request.getHeader("User-Agent"));
        log.setLoginTime(new Timestamp(System.currentTimeMillis())+"");
        
        if (vo == null) {
        	log.setLoginStatus("0");
            log.setFailureReason("이메일 없음");
            log.setUserId(Long.parseLong("0"));
            userService.insertUserLog(log);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일이 존재하지 않습니다.");
        }

        // 2. 비밀번호 확인
        if (!passwordEncoder.matches(user_password, vo.getUser_password())) {
        	log.setLoginStatus("0");
            log.setFailureReason("비밀번호 불일치");
            log.setUserId(vo.getUser_id());
            userService.insertUserLog(log);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }
        
        session.setAttribute("user", vo); // 세션에 유저 저장 (인증 상태 유지)
        
        // 로그인 성공
        log.setLoginStatus("1");
        log.setUserId(vo.getUser_id());
        userService.insertUserLog(log);
        
        // 3. 유저 정보에서 민감한 정보 제외하고 응답
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("user_name", vo.getUser_name());
        userInfo.put("user_id", vo.getUser_id());
        userInfo.put("email", vo.getEmail());
        userInfo.put("phone", vo.getPhone());
        userInfo.put("membership_lvl", vo.getMembership_lvl());
        userInfo.put("gender", vo.getGender());
        userInfo.put("height", vo.getHeight());
        userInfo.put("user_weight", vo.getUser_weight());
        userInfo.put("user_address", vo.getUser_address());
        userInfo.put("reg_date", vo.getReg_date());
        userInfo.put("upd_date", vo.getUpd_date());

        return ResponseEntity.ok(userInfo);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestParam("user_id") String user_id,
    									HttpServletResponse response,
    									HttpServletRequest request,
    									HttpSession session) {
    	// 1. 세션 무효화
        session.invalidate();
        
        // 2. 최신 로그인 로그를 찾고 로그아웃 시간 기록
        UserLogVO lastLog = userService.getLastSuccessfulLogByUserId(Long.parseLong(user_id));
        if (lastLog != null) {
            lastLog.setLogoutTime(new Timestamp(System.currentTimeMillis())+"");
            userService.updateLogoutTime(lastLog);
        }

        // 3. 응답
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
    
    @PostMapping("/myPage")
    public ResponseEntity<?> mypage(HttpSession session) {
    	UserVO svo = (UserVO)session.getAttribute("user");
	    if (svo == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
	    }

	    UserVO vo = userService.getUserById(svo.getUser_id());
	    
    	// 필요한 정보만 추출해서 전송 (보안 고려)
        Map<String, Object> data = new HashMap<>();
        data.put("user_name", vo.getUser_name());
        data.put("user_id", vo.getUser_id());
        data.put("email", vo.getEmail());
        data.put("phone", vo.getPhone());
        data.put("membership_lvl", vo.getMembership_lvl());
        data.put("gender", vo.getGender());
        data.put("height", vo.getHeight());
        data.put("age", vo.getAge());
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
    
    @PostMapping("/googleLogin")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, 
    									  String> body,
    									  HttpServletRequest request,
    									  HttpSession session) {
        String token = body.get("token");
        GoogleUserInfo googleInfo = GoogleTokenVerifier.verify(token); // 직접 구현
        System.out.println(googleInfo);

        // 1. 사용자 조회
    	UserVO vo = userService.getUserByEmail(googleInfo.getEmail());
    	System.out.println(vo);
    	
    	UserLogVO log = new UserLogVO();
        log.setIpAddress(request.getRemoteAddr());
        log.setUserAgent(request.getHeader("User-Agent"));
        log.setLoginTime(new Timestamp(System.currentTimeMillis())+"");
        
        if (vo == null) {
        	log.setLoginStatus("0");
            log.setFailureReason("이메일 없음");
            log.setUserId(Long.parseLong("0"));
            userService.insertUserLog(log);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일이 존재하지 않습니다.");
        }
        
        session.setAttribute("user", vo); // 세션에 유저 저장 (인증 상태 유지)
        
        // 로그인 성공(로그 저장)
        log.setLoginStatus("1");
        log.setUserId(vo.getUser_id());
        userService.insertUserLog(log);
        
        // 3. 유저 정보에서 민감한 정보 제외하고 응답
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("user_name", vo.getUser_name());
        userInfo.put("user_id", vo.getUser_id());
        userInfo.put("email", vo.getEmail());
        userInfo.put("phone", vo.getPhone());
        userInfo.put("membership_lvl", vo.getMembership_lvl());
        userInfo.put("gender", vo.getGender());
        userInfo.put("height", vo.getHeight());
        userInfo.put("user_weight", vo.getUser_weight());
        userInfo.put("user_address", vo.getUser_address());
        userInfo.put("reg_date", vo.getReg_date());
        userInfo.put("upd_date", vo.getUpd_date());

        return ResponseEntity.ok(userInfo);
    }
}