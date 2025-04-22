package com.foodychat.user.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.foodychat.user.vo.BmiHistoryVO;
import com.foodychat.user.vo.FoodRecognitionHistoryVO;
import com.foodychat.user.vo.UserDetailsVO;
import com.foodychat.user.vo.UserLogVO;
import com.foodychat.user.vo.UserMealsVO;
import com.foodychat.user.vo.UserVO;

/**
 * 사용자 DAO (클래스 기반 - SqlSession 직접 사용)
 */
@Repository
public class UserDAO {

    private static final String mapper = "com.foodychat.user.dao.UserDAO";

    @Autowired
    private SqlSession sqlSession;

    // 회원가입 (일반)
    public void insertUser(UserVO user) {
        sqlSession.insert(mapper + ".insertUser", user);
    }

    // 회원가입 (구글)
    public void insertGoogleUser(UserVO user) {
        sqlSession.insert(mapper + ".insertGoogleUser", user);
    }

    // 이메일로 사용자 조회
    public UserVO getUserByEmail(String email) {
        return sqlSession.selectOne(mapper + ".findByEmail", email);
    }

    // 사용자 상세정보 등록
    public void insertUserDetails(UserDetailsVO details) {
        sqlSession.insert(mapper + ".insertUserDetails", details);
    }

    // 전체 사용자 목록 조회 (페이지네이션)
    public List<UserVO> getUserList(int limit, int offset) {
        return sqlSession.selectList(mapper + ".getUserList", Map.of("limit", limit, "offset", offset));
    }

    // 전체 사용자 수 조회
    public int getTotalUserCount() {
        return sqlSession.selectOne(mapper + ".getTotalUserCount");
    }

    // 사용자 삭제
    public void deleteUser(Long userId) {
        sqlSession.delete(mapper + ".deleteUser", userId);
    }

    // 회원 등급 수정
    public void updateMembershipLevel(Long userId, String level) {
        sqlSession.update(mapper + ".updateMembershipLevel", Map.of("userId", userId, "level", level));
    }

    // 사용자 ID로 조회
    public UserVO getUserById(long id) {
        return sqlSession.selectOne(mapper + ".selectUserById", id);
    }

    // 새롭게 추가된 user_id 기반 조회
    public UserVO selectUserByUserId(int userId) {
        return sqlSession.selectOne(mapper + ".selectUserByUserId", userId);
    }

    // 사용자 비밀번호 변경
    public void updatePasswordUser(UserVO user) {
        sqlSession.update(mapper + ".updatePasswordUser", user);
    }

    // 로그인 성공 로그 저장
    public void insertUserLog(UserLogVO log) {
        sqlSession.insert(mapper + ".insertUserLog", log);
    }

    // 마지막 로그인 로그 조회
    public UserLogVO getLastSuccessfulLogByUserId(long userId) {
        return sqlSession.selectOne(mapper + ".selectLastSuccessfulLogByUserId", userId);
    }

    // 로그아웃 시간 업데이트
    public void updateLogoutTime(UserLogVO lastLog) {
        sqlSession.update(mapper + ".updateLogoutTime", lastLog);
    }

    // 사용자 기본 정보 수정
    public void updateUser(UserVO updatedUser) {
        sqlSession.update(mapper + ".updateUser", updatedUser);
    }

    // 사용자 상세 정보 수정
    public void updateUserDetail(UserVO updatedUser) {
        sqlSession.update(mapper + ".updateUserDetail", updatedUser);
    }

    // 사용자 상세 정보 조회
    public UserVO getUserDetailById(long userId) {
        return sqlSession.selectOne(mapper + ".getUserDetailById", userId);
    }

    // 사용자 상세 정보 등록
    public void insertUserDetail(UserVO updatedUser) {
        sqlSession.insert(mapper + ".insertUserDetail", updatedUser);
    }

    // 이름과 전화번호로 ID 찾기
    public String getIdByNameAndPhone(Map<String, String> map) {
        return sqlSession.selectOne(mapper + ".selectIdByNameAndPhone", map);
    }

    // 이메일로 비밀번호 변경
    public void updateUserPasswordByEmail(Map<String, String> map) {
        sqlSession.update(mapper + ".updateUserPasswordByEmail", map);
    }
    
    /**
	 * 회원 식단정보 가져오기
	 * */
	public List<UserMealsVO> getMeals(long user_id) {
		return sqlSession.selectList(mapper + ".selectMeals", user_id);
	}

	// 이메일 중복 여부 확인
    public boolean isEmailExists(String email) {
        Integer count = sqlSession.selectOne(mapper + ".isEmailExists", email);
        return count != null && count > 0;
    }

    // BMI 히스토리 조회
    public List<BmiHistoryVO> selectBmiHistoryByUserId(Long userId) {
        return sqlSession.selectList(mapper + ".selectBmiHistoryByUserId", userId);
    }

    // 음식 인식 히스토리 조회
    public List<FoodRecognitionHistoryVO> selectFoodHistoryByUserId(Long userId) {
        return sqlSession.selectList(mapper + ".selectFoodHistoryByUserId", userId);
    }
	
    // 최근 일주일간 신규 사용자 수
    public int getNewUserCountThisMonth() {
        return sqlSession.selectOne(mapper + ".getNewUserCountThisMonth");
    }

    // 회원 등급별 사용자 수 (Map<등급, 수>)
    public List<Map<String, Object>> getUserCountByGrade() {
        return sqlSession.selectList(mapper + ".getUserCountByGrade");
    }

}
