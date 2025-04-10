package com.foodychat.user.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.foodychat.user.vo.UserDetailsVO;
import com.foodychat.user.vo.UserVO;

/**
 * 사용자 DAO (MyBatis)
 */
public interface UserDAO {
    void insertUser(UserVO user);                 // 일반 회원가입
    UserVO findByEmail(String email);             // 이메일로 사용자 조회
    void insertGoogleUser(UserVO user);           // 구글 로그인 시 새 유저 등록
    void insertUserDetails(UserDetailsVO details); //유저 세부정보 입력.
    List<UserVO> getUserList(@Param("limit") int limit, @Param("offset") int offset); //유저 전체 목록
    int getTotalUserCount();//유저 수 카운트
	void deleteUser(Long userId);
	void updateMembershipLevel(@Param("userId") Long userId, @Param("level") String level);
}