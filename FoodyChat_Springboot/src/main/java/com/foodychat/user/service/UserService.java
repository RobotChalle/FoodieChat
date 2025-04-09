package com.foodychat.user.service;

import com.foodychat.user.vo.UserLogVO;
import com.foodychat.user.vo.UserVO;

/**
 * 사용자 서비스 클래스
 */
public interface UserService {

	/**
     * 모든 사용자 조회(아이디)
     */
	UserVO getUserById(long id);
	
	/**
	 * 이메일로 사용자 조회
	 * */
	UserVO getUserByEmail(String email);
	
	/**
	 * 비밀번호 변경
	 * */
	boolean changePassword(String userEmail, String currentPassword, String newPassword);
	
	/**
	 * 로그저장
	 * */
	void insertUserLog(UserLogVO log);
	
	/**
	 * 마지막로그인 정보 확인
	 * */
	UserLogVO getLastSuccessfulLogByUserId(long user_id);
	
	/**
	 * 로그아웃시간 저장
	 * */
	void updateLogoutTime(UserLogVO lastLog);
}
