package com.foodychat.user.service;
import java.util.List;

import com.foodychat.user.vo.UserDetailsVO;
import com.foodychat.user.vo.UserLogVO;
import com.foodychat.user.vo.UserMealsVO;
import com.foodychat.user.vo.UserVO;/**


 * 사용자 서비스 클래스
 */
public interface UserService {

	/**
     * 모든 사용자 조회(아이디)
     */
    void registerUser(UserVO user);           	// 일반 회원가입
    void registerGoogleUser(UserVO user);   	// 구글 회원가입
    void saveUserDetails(UserDetailsVO details);//회원가입시 상세정보 입력.
	int getTotalUserCount(); 					//유저 숫자
	List<UserVO> getUserList(int page, int size);//전체 유저 정보
	void deleteUser(Long userId); 				//삭제 유저
	void updateMembershipLevel(Long userId, String level); //유저 등급 변경.
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
	
	/**
	 * 회원 식단정보 가져오기
	 * */
	List<UserMealsVO> getMeals(long user_id);
}