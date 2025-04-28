package com.foodychat.user.controller;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.foodychat.user.vo.BmiHistoryVO;
import com.foodychat.user.vo.CommonCodeSaveVO;
import com.foodychat.user.vo.CommonCodesVO;
import com.foodychat.user.vo.FoodRecognitionHistoryVO;
import com.foodychat.user.vo.GoogleUserInfo;
import com.foodychat.user.vo.UserDetailsVO;
import com.foodychat.user.vo.UserLogVO;
import com.foodychat.user.vo.UserMealsVO;
import com.foodychat.user.vo.UserVO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 * 사용자 관리 컨트롤러
 */
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "${react.url}", allowCredentials = "true")
public class UserController {
    @Autowired
    private UserService userService;
	
    @Autowired
    private EmailService emailService;

	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Value("${react.url}")
	private String reactiUrl;
	
	@Value("${fastapi.url}")
    private String fastapiUrl;
	
	@Autowired
	private AuthenticationManager authenticationManager;

	// 🟢 일반 로그인
	@PostMapping("/loginUser")
    public ResponseEntity<?> loginUser(@RequestParam String email, @RequestParam String user_password,
                                       HttpServletRequest request, HttpSession session) {
        try {
            UsernamePasswordAuthenticationToken authRequest =
                    new UsernamePasswordAuthenticationToken(email, user_password);
            Authentication authentication = authenticationManager.authenticate(authRequest);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            if (!(authentication.getPrincipal() instanceof UserVO vo)) {
                throw new AuthenticationServiceException("인증된 사용자 정보가 올바르지 않습니다.");
            }

            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            session.setAttribute("user", vo);

            // ✅ 로그인 로그 기록
            UserLogVO log = new UserLogVO();
            log.setIpAddress(request.getRemoteAddr());
            log.setUserAgent(request.getHeader("User-Agent"));
            log.setLoginTime(new Timestamp(System.currentTimeMillis()) + "");
            log.setLoginStatus("1");
            log.setUserId(vo.getUser_id());
            userService.insertUserLog(log);

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
        } catch (BadCredentialsException e) {
            UserVO user = userService.getUserByEmail(email);
            UserLogVO log = new UserLogVO();
            log.setIpAddress(request.getRemoteAddr());
            log.setUserAgent(request.getHeader("User-Agent"));
            log.setLoginTime(new Timestamp(System.currentTimeMillis()) + "");
            log.setLoginStatus("0");
            log.setFailureReason("이메일 또는 비밀번호 불일치");
            log.setUserId(user != null ? user.getUser_id() : 0L);
            userService.insertUserLog(log);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
    }
    
	@PostMapping("/logout")
	public ResponseEntity<?> logoutUser(HttpServletRequest request,
	                                    HttpServletResponse response,
	                                    HttpSession session) {
	    try {
	        UserVO user = (UserVO) session.getAttribute("user");

	        if (user != null) {
	            // 로그아웃 시간 기록
	            UserLogVO lastLog = userService.getLastSuccessfulLogByUserId(user.getUser_id());
	            if (lastLog != null) {
	                lastLog.setLogoutTime(new Timestamp(System.currentTimeMillis()).toString());
	                userService.updateLogoutTime(lastLog);
	            }
	        }

	        // 세션 무효화
	        session.invalidate();

	        // 응답 반환
	        return ResponseEntity.ok().body(Map.of("message", "로그아웃 되었습니다."));
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body(Map.of("error", "로그아웃 처리 중 오류가 발생했습니다."));
	    }
	}
    
    @PostMapping("/myPage")
    public ResponseEntity<?> mypage(HttpSession session) {
    	UserVO sessionUser = (UserVO) session.getAttribute("user");
    	System.out.println("🌐 세션 유저 확인: " + (sessionUser != null ? sessionUser.getEmail() : "null"));
    	
    	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    	System.out.println("🧪 인증 객체: " + auth);
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        UserVO user = (UserVO) auth.getPrincipal(); // ✅ 인증된 유저 객체
        System.out.println("✅ 인증된 유저: " + user.getEmail());

	    UserVO vo = userService.getUserById(user.getUser_id());
	    
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
        data.put("google_id", vo.getGoogle_id());
        
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
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body, 
    									 HttpServletRequest request, 
    									 HttpSession session) {
        String token = body.get("token");
        GoogleUserInfo googleInfo = GoogleTokenVerifier.verify(token);
        UserVO vo = userService.getUserByEmail(googleInfo.getEmail());

        UserLogVO log = new UserLogVO();
        log.setIpAddress(request.getRemoteAddr());
        log.setUserAgent(request.getHeader("User-Agent"));
        log.setLoginTime(new Timestamp(System.currentTimeMillis()) + "");

        if (vo == null) {
            log.setLoginStatus("0");
            log.setFailureReason("이메일 없음");
            log.setUserId(0L);
            userService.insertUserLog(log);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일이 존재하지 않습니다.");
        }

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                vo, null, List.of(new SimpleGrantedAuthority("ROLE_" + vo.getMembership_level().toUpperCase())));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
        session.setAttribute("user", vo);
        
        log.setLoginStatus("1");
        log.setUserId(vo.getUser_id());
        userService.insertUserLog(log);

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
							        		 @RequestParam("gender") String gender,
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
            updatedUser.setGender(gender);
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
            if (email == null || email.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("가입된 아이디가 없습니다.");
            }
            return ResponseEntity.ok(email);
        } catch (Exception e) {
        	e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
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
        String resetLink = reactiUrl+"/reset-password?token=" + token;

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
    	try {
            if (userService.isEmailExists(userVO.getEmail())) {
                // ✅ 중복 시 409 반환 + JSON 형태의 메시지
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "이미 가입된 이메일입니다.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }

            userService.registerUser(userVO);
            UserVO vo = userService.getUserByEmail(userVO.getEmail());

            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("user_id", vo.getUser_id());
            successResponse.put("message", "회원가입이 완료되었습니다.");
            return ResponseEntity.status(HttpStatus.CREATED).body(successResponse);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "회원가입 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
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
        @RequestParam(name = "size", defaultValue = "5") int size
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
    public ResponseEntity<?> sessionConfirm(Authentication authentication, 
    										HttpSession session) {
    	System.out.println("🔒 Session ID: " + session.getId());
        System.out.println("🔒 Auth: " + authentication);
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserVO user) {
            session.setAttribute("user", user);
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("user_name", user.getUser_name());
            userInfo.put("google_id", user.getGoogle_id());
            userInfo.put("user_id", user.getUser_id());
            userInfo.put("email", user.getEmail());
            userInfo.put("phone", user.getPhone());
            userInfo.put("membership_level", user.getMembership_level());
            userInfo.put("gender", user.getGender());
            userInfo.put("height", user.getHeight());
            userInfo.put("user_weight", user.getUser_weight());
            userInfo.put("user_address", user.getUser_address());
            userInfo.put("reg_date", user.getReg_date());
            userInfo.put("upd_date", user.getUpd_date());
            return ResponseEntity.ok(userInfo);
        } else {
            return ResponseEntity.ok(null);
        }
    }

    //세션에서 유저 아이디 반환
    @GetMapping("/user-id")
    public ResponseEntity<?> getUserId(HttpSession session) {
    UserVO user = (UserVO) session.getAttribute("user");
    System.out.println("세션에 저장된 유저: " + user);  // null이면 세션이 안 붙은 것
        if (user != null) {
            return ResponseEntity.ok(user.getUser_id());
        } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
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
       ResponseEntity<String> response = restTemplate.postForEntity(fastapiUrl+"/query", entity, String.class);
       return ResponseEntity.ok(response.getBody());
   }

   // 유저 int 아이디로 조회
    @GetMapping("/{id}/details")
    public ResponseEntity<UserVO> getUserRagInfo(@PathVariable("id") int userId) {
	    UserVO userInfo = userService.getUserInfoByUserId(userId);
	    return ResponseEntity.ok(userInfo);
    }

    // ✅ BMI 히스토리 조회
    @GetMapping("/{id}/bmi")
    public ResponseEntity<List<BmiHistoryVO>> getBmiHistory(@PathVariable("id") Long userId) {
	    List<BmiHistoryVO> bmiHistory = userService.getBmiHistory(userId);
	    return ResponseEntity.ok(bmiHistory);
    }

    // ✅ 음식 인식 히스토리 조회
    @GetMapping("/{id}/meals")
    public ResponseEntity<List<FoodRecognitionHistoryVO>> getFoodHistory(@PathVariable("id") Long userId) {
	    List<FoodRecognitionHistoryVO> foodHistory = userService.getFoodHistory(userId);
	    return ResponseEntity.ok(foodHistory);
    }
    
    @GetMapping("/admin/logs")
    public ResponseEntity<?> getUserLogList(
        @RequestParam(name = "page", defaultValue = "1") int page,
        @RequestParam(name = "size", defaultValue = "10") int size,
        @RequestParam(name = "email", required = false) String email,
        @RequestParam(name = "status", required = false) String status,
        @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
    	int offset = (page - 1) * size;
    	List<UserLogVO> logs = userService.getUserLogList(email, status, startDate, endDate, size, offset);
        int total = userService.getTotalUserLogCount(email, status, startDate, endDate);

        Map<String, Object> result = new HashMap<>();
        result.put("logs", logs);
        result.put("total", total);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/admin/codes")
    public ResponseEntity<?> getCommonCodesList() {
    	List<CommonCodesVO> codes = userService.getCommonCodesList();
        return ResponseEntity.ok(codes);
    }
    
    @GetMapping("/admin/codes/{code_id}/details")
    public ResponseEntity<?> getCommonCodesDetailList(@PathVariable("code_id") String code_id) {
    	List<CommonCodesVO> codes = userService.getCommonCodesDetailList(code_id);
        return ResponseEntity.ok(codes);
    }
    
    @PostMapping("/admin/codes/save")
    public ResponseEntity<?> saveCodeAndDetails(@RequestBody CommonCodeSaveVO request,
    											HttpSession session,
   	    									 	HttpServletRequest req) {
        CommonCodesVO code = request.getCode();
        List<CommonCodesVO> details = request.getDetails();
        
        UserVO svo = (UserVO)session.getAttribute("user");
        code.setLogin_id(svo.getUser_id());
        code.setLogin_ip(req.getRemoteAddr());

        boolean exists = userService.codeExists(code.getCode_id());

        if (exists) {
        	userService.updateCode(code);
        } else {
        	userService.insertCode(code);
        }

        userService.upsertDetails(code.getCode_id(), details, session, req); // ON DUPLICATE 방식 또는 조건 분기

        return ResponseEntity.ok("저장 완료");
    }
    
    @DeleteMapping("/admin/codes/delete/{codeId}")
    public ResponseEntity<?> deleteCommonCodes(@PathVariable("codeId") String codeId) {
    	userService.deleteCodeWithDetails(codeId); // 코드 + 세부항목 함께 삭제
        return ResponseEntity.ok("삭제 완료");
    }
    
    @DeleteMapping("/admin/codes/delete/{codeId}/details/{detailCode}")
    public ResponseEntity<?> deleteDetailCode(@PathVariable("codeId") String codeId,
                                              @PathVariable("detailCode") String detailCode) {
    	userService.deleteDetailCode(codeId, detailCode);
        return ResponseEntity.ok("세부항목 삭제 완료");
    }
    
    @GetMapping("codes/{code_id}/details")
    public ResponseEntity<?> getCommonCodesDetailList2(@PathVariable("code_id") String code_id) {
    	List<CommonCodesVO> codes = userService.getCommonCodesDetailList(code_id);
        return ResponseEntity.ok(codes);
    }
}