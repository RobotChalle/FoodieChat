package com.foodychat.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.net.URI;

public class PythonModelCaller {
	private static final String PYTHON_API_URL = "http://localhost:8000/predict";

    /**
     * FastAPI로 이미지 전송하여 예측 결과(JsonNode)를 반환
     * @param imagePath 저장된 이미지 파일 경로
     * @return 예측 결과 JSON (predictedClass, confidence, topK)
     * @throws Exception API 호출 실패 또는 응답 오류 시 예외 발생
     */
    public static JsonNode predictJson(String imagePath) throws Exception {
        // 1. 이미지 파일을 멀티파트로 준비
        File imageFile = new File(imagePath);
        if (!imageFile.exists()) {
            throw new IllegalArgumentException("이미지 파일이 존재하지 않습니다: " + imagePath);
        }

        FileSystemResource imageResource = new FileSystemResource(imageFile);

        MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
        formData.add("file", imageResource);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(formData, headers);

        // 2. 요청 전송
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                URI.create(PYTHON_API_URL),
                requestEntity,
                String.class
        );

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("FastAPI 예측 실패: " + response.getStatusCode());
        }

        // 3. 응답 본문을 JSON으로 파싱
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readTree(response.getBody());
    }

    /**
     * 예측된 음식 이름(predictedClass)만 반환하는 단축 버전
     */
    public static String predictClass(String imagePath) throws Exception {
        JsonNode json = predictJson(imagePath);
        return json.get("predictedClass").asText();
    }
}
