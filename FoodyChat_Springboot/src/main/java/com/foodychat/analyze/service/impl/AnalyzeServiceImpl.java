package com.foodychat.analyze.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foodychat.analyze.dao.AnalyzeDAO;
import com.foodychat.analyze.service.AnalyzeService;
import com.foodychat.analyze.vo.AnalyzeVO;
import com.foodychat.analyze.vo.MealRecommendationVO;

/**
 * 이미지분석 서비스 구현 클래스
 */	
@Service
public class AnalyzeServiceImpl implements AnalyzeService {
	@Autowired
	AnalyzeDAO analyzeDao;

	/**
	 * 추천 받은 식단 등록
	 * */
	@Override
	public void insertRecommendedMeal(MealRecommendationVO vo) {
		analyzeDao.insertRecommendedMeal(vo);
	}
	
	/**
	 * 추천 받은 식단 수정
	 * */
	@Override
	public void updateRecommendedMeal(MealRecommendationVO vo) {
		analyzeDao.updateRecommendedMeal(vo);
	}

	/**
	 * 식단 정보
	 * param : user_id, meal_date, meal_type
	 * */
	@Override
	public MealRecommendationVO selectRecommendedMeal(Long user_id, String meal_date, String meal_type) {
		Map<String,String> map = new HashMap<String,String>();
		map.put("user_id", user_id+"");
		map.put("meal_date", meal_date);
		map.put("meal_type", meal_type);
		return analyzeDao.selectRecommendedMeal(map);
	}
	/**
	 * 식단 정보
	 * param : user_id, meal_date, meal_type
	 * @return 
	 * */
	@Override
	public AnalyzeVO selectFoodbyName(String foodName) {
		return analyzeDao.selectFoodbyName(foodName);
	}
}