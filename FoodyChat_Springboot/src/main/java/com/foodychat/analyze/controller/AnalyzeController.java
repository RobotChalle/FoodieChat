package com.foodychat.analyze.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodychat.analyze.service.AnalyzeService;
import com.foodychat.analyze.vo.AnalyzeVO;
import com.foodychat.analyze.vo.MealRecommendationVO;
import com.foodychat.chat.controller.ChatController;
import com.foodychat.user.service.UserService;
import com.foodychat.user.vo.UserVO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

/**
 * 이미지 분석 컨트롤러
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/analyze")
public class AnalyzeController {

    private final ChatController chatController;
	@Autowired
    AnalyzeService analyzeService;
	
	@Autowired
    private UserService userService;
	
	private final RestTemplate restTemplate = new RestTemplate();

	/**
   	 * 유저 식단 추천 처리(DB저장)
   	 * */
	@PostMapping("/recommend")
    public ResponseEntity<?> recommendMeals(@RequestParam("start") String start,
            								@RequestParam("end") String end,
            								@RequestParam("types") String types,
            								HttpSession session,
	    									HttpServletRequest request) {
		try {
			UserVO svo = (UserVO)session.getAttribute("user");
			if (svo == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(Map.of("error", "로그인이 필요합니다."));
			}
			Long userId = svo.getUser_id();
			UserVO info = userService.getUserById(userId);
			String goal = info.getHealth_goal();
			if (goal == null || goal.isBlank()) {
			    return ResponseEntity.badRequest().body(Map.of("error", "건강목표가 비어있습니다."));
			}
			
			String encodedGoal = URLEncoder.encode(info.getHealth_goal(), StandardCharsets.UTF_8);

	        URI uri = UriComponentsBuilder.fromHttpUrl("http://localhost:8000/recommend")
	                .queryParam("start", start)
	                .queryParam("end", end)
	                .queryParam("types", types)
	                .queryParam("gender", info.getGender())
	                .queryParam("health_goal", encodedGoal)
	                .queryParam("age", info.getAge())
	                .queryParam("height", info.getHeight())
	                .queryParam("user_weight", info.getUser_weight())
	                .build(false)
	                .toUri();

	        ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
	        
	        ObjectMapper mapper = new ObjectMapper();
	        Map<String, List<Map<String, String>>> resultMap = mapper.readValue(response.getBody(), Map.class);
	        List<Map<String, String>> resultList = resultMap.get("result");
	        
	        for (Map<String, String> item : resultList) {
	            MealRecommendationVO vo = new MealRecommendationVO();
	            vo.setUser_id(userId);
	            vo.setRec_date(item.get("date"));
	            String type_cd = "1";
	            if(item.get("type").equals("조식")) {
	            	type_cd = "1";
	            }else if(item.get("type").equals("중식")) {
	            	type_cd = "2";
	            }else if(item.get("type").equals("석식")) {
	            	type_cd = "3";
	            }
	            vo.setMeal_type(type_cd);
	            vo.setMenu(item.get("menu"));
	            vo.setLogin_id(svo.getUser_id());
	            vo.setLogin_ip(request.getRemoteAddr());

	            MealRecommendationVO existVO = analyzeService.selectRecommendedMeal(userId, item.get("date"), type_cd);
	            if (existVO == null) {
	            	analyzeService.insertRecommendedMeal(vo); // MyBatis로 insert
	            }else {
	            	analyzeService.updateRecommendedMeal(vo); // MyBatis로 update
	            }
	        }
	        
	        return ResponseEntity.ok(response.getBody());

	    } catch (RestClientException e) {
	        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
	                .body(Map.of("error", "LLM 서버 요청 실패", "details", e.getMessage()));
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of("error", "알 수 없는 오류 발생", "details", e.getMessage()));
	    }
    }
	
	/**
   	 * 음식명칭 한글 목록
   	 * */
	@GetMapping("/foods/translations")
    public ResponseEntity<Map<String, String>> getFoodTranslations() {
        List<AnalyzeVO> list = analyzeService.getFoodTranslations(); // DB에서 가져옴
        
        Map<String, String> result = new HashMap<>();
    	for(int i=0;i<list.size();i++) {
    		AnalyzeVO vo = list.get(i);
    		result.put(vo.getFood_name(), vo.getFood_ko_name());
        }
        return ResponseEntity.ok(result);
    }
	
	/**
   	 * 음식의 영양정보 추출 처리
   	 * */
	@PostMapping("/food")
    public ResponseEntity<?> recommendCafeteria(@RequestParam("foodName") String foodName,
            								   	HttpSession session,
            								   	HttpServletRequest request) {
		AnalyzeVO vo = analyzeService.selectFoodbyName(foodName);
		Map<String, Object> voInfo = new HashMap<>();
		voInfo.put("calories", vo.getCalories());
        voInfo.put("nut_carb", vo.getNut_carb());
        voInfo.put("nut_pro", vo.getNut_pro());
        voInfo.put("nut_fat", vo.getNut_fat());

        return ResponseEntity.ok(voInfo);
	}
	
	@PostMapping("/store")
	public ResponseEntity<?> crawl(@RequestParam Map<String, String> req,
	                               HttpSession session,
	                               HttpServletRequest request) {
	    String foodName = req.get("foodName");
	    String location = req.get("location");

	    try {
	        // ✅ Python 파일 실행 - 경로 주의 (상대 or 절대)
	    	String pythonScriptPath = "D:\\workspace\\FoodyChat\\foodychat_python\\foodychat_python\\store.py";
	        ProcessBuilder pb = new ProcessBuilder("python", pythonScriptPath, foodName, location);
	        pb.redirectErrorStream(true); // stderr도 stdout으로 병합
	        Process process = pb.start();

	        // ✅ Python stdout 읽기
	        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
	        StringBuilder outputBuilder = new StringBuilder();
	        String line;
	        while ((line = reader.readLine()) != null) {
	            System.out.println("[PYTHON STDOUT] " + line);
	            outputBuilder.append(line);
	        }

	        // ✅ 종료까지 대기
	        int exitCode = process.waitFor();
	        System.out.println("Python 종료 코드: " + exitCode);

	        // ✅ 파이썬 출력 확인
	        String json = outputBuilder.toString().trim();
	        System.out.println("최종 JSON 문자열: " + json);

	        // ✅ JSON 파싱
	        ObjectMapper objectMapper = new ObjectMapper();
	        List<Map<String, String>> results = objectMapper.readValue(json, new TypeReference<>() {});

	        return ResponseEntity.ok(results);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(500).body(Map.of(
	                "error", "Python 실행 또는 JSON 파싱 중 오류 발생",
	                "message", e.getMessage()
	        ));
	    }
	}

}