package com.foodychat.analyze.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.foodychat.analyze.vo.AnalyzeVO;
import com.foodychat.analyze.vo.MealRecommendationVO;

/**
 * 이미지분석 DAO (MyBatis)
 */
@Repository
public class AnalyzeDAO {
	private static String mapper = "com.foodychat.analyze.dao.AnalyzeDAO";

    @Autowired
    private SqlSession sqlSession;

	public void insertRecommendedMeal(MealRecommendationVO vo) {
		sqlSession.insert(mapper + ".insertRecommendedMeal", vo);
	}
	
	public void updateRecommendedMeal(MealRecommendationVO vo) {
		sqlSession.update(mapper + ".updateRecommendedMeal", vo);
	}

	public MealRecommendationVO selectRecommendedMeal(Map<String, String> map) {
		return sqlSession.selectOne(mapper + ".selectRecommendedMeal", map);
	}

	public AnalyzeVO selectFoodbyName(String foodName) {
		return sqlSession.selectOne(mapper + ".selectFoodbyName", foodName);
	}
	/**
   	 * 음식명칭 한글 목록
   	 * */
	public List<AnalyzeVO> getFoodTranslations() {
		return sqlSession.selectList(mapper + ".selectFoodTranslations");
	}
}