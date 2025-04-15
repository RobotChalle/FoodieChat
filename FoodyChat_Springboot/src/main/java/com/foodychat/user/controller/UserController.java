package com.foodychat.user.controller;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.foodychat.config.EmailService;
import com.foodychat.config.GoogleTokenVerifier;
import com.foodychat.user.service.UserService;
import com.foodychat.user.vo.GoogleUserInfo;
import com.foodychat.user.vo.UserDetailsVO;
import com.foodychat.user.vo.UserLogVO;
import com.foodychat.user.vo.UserVO;
import com.foodychat.user.vo.UserMealsVO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 * 사용자 관리 컨트롤러
 */
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {
    @Autowired
    private UserService userService;
	
    @Autowired
    private EmailService emailService;

	@Autowired
	PasswordEncoder passwordEncoder;

    // 🟢 일반 로그인
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
        userInfo.put("membership_level", vo.getMembership_level());
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
        data.put("membership_level", vo.getMembership_level());
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
								    	    @RequestParam("newPassword") String newPassword,
	    									HttpSession session) {
    	UserVO svo = (UserVO)session.getAttribute("user");
        String userEmail = svo.getEmail(); // 로그인된 사용자
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

        // 1. 사용자 조회
    	UserVO vo = userService.getUserByEmail(googleInfo.getEmail());
    	
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
        userInfo.put("membership_level", vo.getMembership_level());
        userInfo.put("gender", vo.getGender());
        userInfo.put("height", vo.getHeight());
        userInfo.put("user_weight", vo.getUser_weight());
        userInfo.put("user_address", vo.getUser_address());
        userInfo.put("reg_date", vo.getReg_date());
        userInfo.put("upd_date", vo.getUpd_date());

        return ResponseEntity.ok(userInfo);
    }
    
    @PostMapping("/updateUser")
    public ResponseEntity<String> updateUser(@RequestParam("user_id") String userId,
							        		 @RequestParam("user_name") String userName,
							        		 @RequestParam("phone") String phone,
							        		 @RequestParam("age") int age,
							        		 @RequestParam("user_weight") float weight,
							        		 @RequestParam("height") float height,
							        		 @RequestParam("user_address") String address,
	    									 HttpSession session,
	    									 HttpServletRequest request) {
        try {
        	UserVO updatedUser = new UserVO();
            updatedUser.setUser_id(Long.parseLong(userId));
            updatedUser.setUser_name(userName);
            updatedUser.setPhone(phone);
            updatedUser.setAge(age);
            updatedUser.setUser_weight(weight);
            updatedUser.setHeight(height);
            updatedUser.setUser_address(address);
            
            UserVO svo = (UserVO)session.getAttribute("user");
            updatedUser.setLogin_id(svo.getUser_id());
            updatedUser.setLogin_ip(request.getRemoteAddr());

            UserVO vo = userService.getUserDetailById(updatedUser.getUser_id());
            
            userService.updateUser(updatedUser);
            if(vo == null) {
            	userService.insertUserDetail(updatedUser);
            }else {
            	userService.updateUserDetail(updatedUser);
            }

            return ResponseEntity.ok("업데이트 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업데이트 실패");
        }
    }
    
    @PostMapping("/findId")
    public ResponseEntity<String> findIdByNameAndPhone(@RequestParam("user_name") String userName,
							        	 			   @RequestParam("phone") String phone,
							        	 			   HttpSession session,
							        	 			   HttpServletRequest request) {
        try {
            String email = userService.getIdByNameAndPhone(userName,phone);
            return ResponseEntity.ok(email);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업데이트 실패");
        }
    }
    
    @PostMapping("/findPassword")
    public ResponseEntity<?> sendPasswordResetLink(@RequestParam("email") String email) {
        boolean valid = userService.validateUserInfo(email);
        if (!valid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("입력하신 정보와 일치하는 계정을 찾을 수 없습니다.");
        }

        // 토큰 생성
        String token = UUID.randomUUID().toString();

        // 토큰 저장
        userService.savePasswordResetToken(email, token);

        // 비밀번호 재설정 링크 생성
        String resetLink = "http://localhost:3000/reset-password?token=" + token;

        // 이메일 발송
        String subject = "비밀번호 재설정 안내";
        String body = "아래 링크를 클릭하여 비밀번호를 재설정하세요:\n" + resetLink;

        emailService.sendEmail(email, subject, body);

        return ResponseEntity.ok("비밀번호 재설정 링크를 이메일로 전송했습니다.");
    }
    
    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token,
                                           @RequestParam("newPassword") String newPassword) {
        try {
            boolean success = userService.resetPassword(token, newPassword);
            if (success) {
                return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("토큰이 유효하지 않거나 만료되었습니다.");
            }
        } catch (Exception e) {
        	e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 변경 중 오류가 발생했습니다.");
        }
    }

    // 🟢 일반 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody UserVO userVO) {
        userService.registerUser(userVO);
        Map<String, Object> response = new HashMap<>();
        UserVO vo = userService.getUserByEmail(userVO.getEmail());
        response.put("message", "회원가입 성공");
        response.put("user_id", vo.getUser_id());
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
        user.setMembership_level("regular");

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
    public ResponseEntity<?> deleteUser(@PathVariable("userId") Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("삭제 성공");
    }
    
    // 🟡 관리자용 유저 등급 변경
    @PatchMapping("/admin/users/{userId}/membership")
    public ResponseEntity<?> updateMembershipLevel(
        @PathVariable("userId") Long userId, // ✅ "userId" 명시!
        @RequestBody Map<String, String> request
    ) {
        String newLevel = request.get("membership_level");
        userService.updateMembershipLevel(userId, newLevel);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ses")
    public ResponseEntity<?> sessionConfirm(HttpSession session) {
    	UserVO svo = (UserVO)session.getAttribute("user");
    	
    	if(svo != null) {
	    	// 3. 유저 정보에서 민감한 정보 제외하고 응답
	        Map<String, Object> userInfo = new HashMap<>();
	        userInfo.put("user_name", svo.getUser_name());
	        userInfo.put("user_id", svo.getUser_id());
	        userInfo.put("email", svo.getEmail());
	        userInfo.put("phone", svo.getPhone());
	        userInfo.put("membership_level", svo.getMembership_level());
	        userInfo.put("gender", svo.getGender());
	        userInfo.put("height", svo.getHeight());
	        userInfo.put("user_weight", svo.getUser_weight());
	        userInfo.put("user_address", svo.getUser_address());
	        userInfo.put("reg_date", svo.getReg_date());
	        userInfo.put("upd_date", svo.getUpd_date());
	
	        return ResponseEntity.ok(userInfo);
    	}else {
    		return ResponseEntity.ok(null);
    	}
    }
    
    /**
   	 * 유저 식단 조회
   	 * */
    @GetMapping("/meals")
    public ResponseEntity<List<Map<String, String>>> getMeals(HttpSession session) {
    	UserVO svo = (UserVO)session.getAttribute("user");
        List<UserMealsVO> meals = userService.getMeals(svo.getUser_id());
	    // 필요한 필드만 추출해서 반환
        List<Map<String, String>> simplifiedMeals = meals.stream()
        		.map(meal -> {
        			Map<String, String> map = new HashMap<>();
        			map.put("meal_date", meal.getMeal_date());
        			map.put("meal_type_nm", meal.getMeal_type_nm());
        			map.put("meal_text", meal.getMeal_text());
        			return map;
        		})
        		.collect(Collectors.toList());
        return ResponseEntity.ok(simplifiedMeals);
    }
    
    /**
   	 * 유저 식단 조회
   	 * */
   @PostMapping("/meals")
   public ResponseEntity<String> queryLLM(@RequestBody Map<String, Object> payload) {
	   String userQuery = (String) payload.get("userQuery");
       List<?> meals = (List<?>) payload.get("meals");

       RestTemplate restTemplate = new RestTemplate();
       HttpHeaders headers = new HttpHeaders();
       headers.setContentType(MediaType.APPLICATION_JSON);

       Map<String, Object> requestBody = new HashMap<>();
       requestBody.put("query", userQuery);
       requestBody.put("meals", meals);

       HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
       ResponseEntity<String> response = restTemplate.postForEntity("http://localhost:8000/query", entity, String.class);
       return ResponseEntity.ok(response.getBody());
   }
}
