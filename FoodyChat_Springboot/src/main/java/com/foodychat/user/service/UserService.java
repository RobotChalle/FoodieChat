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

	/**
	 * 회원정보 수정
	 * */
	void updateUser(UserVO updatedUser);

	/**
	 * 회원상세정보 수정
	 * */
	void updateUserDetail(UserVO updatedUser);

	/**
	 * 회원상세정보 존재여부
	 * */
	UserVO getUserDetailById(long user_id);

	/**
	 * 회원상세정보 등록
	 * */
	void insertUserDetail(UserVO updatedUser);

	/**
	 * 이름, 전화번호로 아이디찾기
	 * */
	String getIdByNameAndPhone(String userName, String phone);

	/**
	 * 유저정보 validation
	 * */
	boolean validateUserInfo(String email);

	/**
	 * 비밀번호 초기화
	 * */
	void savePasswordResetToken(String email, String token);

	/**
	 * 비밀번호 변경
	 * */
	boolean resetPassword(String token, String newPassword);
}
