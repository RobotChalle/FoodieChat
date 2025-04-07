package com.foodychat.analyze.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodychat.analyze.service.AnalyzeService;

/**
 * 이미지 분석 컨트롤러
 */
@RestController
@RequestMapping("/analyze")
public class AnalyzeController {
	@Autowired
    AnalyzeService analyzeService;
}