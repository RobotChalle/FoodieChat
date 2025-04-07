package com.foodychat.analyze.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foodychat.analyze.dao.AnalyzeDAO;
import com.foodychat.analyze.service.AnalyzeService;

/**
 * 사용자 서비스 구현 클래스
 */	
@Service
public class AnalyzeServiceImpl implements AnalyzeService {
	@Autowired
	AnalyzeDAO analyzeDao;
}