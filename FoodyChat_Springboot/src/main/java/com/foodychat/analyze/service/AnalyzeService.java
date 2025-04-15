package com.foodychat.analyze.service;

import org.springframework.stereotype.Repository;

import com.foodychat.analyze.vo.AnalyzeVO;
import com.foodychat.analyze.vo.MealRecommendationVO;

/**
 * 이미지분석 서비스 클래스
 */
@Repository
public interface AnalyzeService {
	/**
	 * 추천 받은 식단 등록
	 * */
	void insertRecommendedMeal(MealRecommendationVO vo);
	/**
	 * 추천 받은 식단 수정
	 * */
	void updateRecommendedMeal(MealRecommendationVO vo);
	/**
	 * 식단 정보
	 * param : user_id, meal_date, meal_type
	 * */
	MealRecommendationVO selectRecommendedMeal(Long user_id, String meal_date, String meal_type);
	/**
	 * 식단 정보
	 * param : user_id, meal_date, meal_type
	 * @return 
	 * */
	AnalyzeVO selectFoodbyName(String foodName);
}
