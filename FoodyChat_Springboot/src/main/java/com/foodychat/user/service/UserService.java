package com.foodychat.user.service;
import com.foodychat.user.vo.UserDetailsVO;
import com.foodychat.user.vo.UserVO;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.foodychat.user.vo.UserVO;
import com.foodychat.user.vo.UserVO;
import com.foodychat.user.vo.UserVO;
import com.foodychat.user.vo.UserVO;

import com.foodychat.user.vo.UserVO;

import com.foodychat.user.vo.UserVO;/**


 * 사용자 서비스 클래스
 */
@Repository
public interface UserService {

	/**
     * 모든 사용자 조회
     */
    void registerUser(UserVO user);           	// 일반 회원가입
    void registerGoogleUser(UserVO user);   	// 구글 회원가입
    UserVO getUserByEmail(String email);		//유저 정보 가져오기
    void saveUserDetails(UserDetailsVO details);//회원가입시 상세정보 입력.
	int getTotalUserCount(); 					//유저 숫자
	List<UserVO> getUserList(int page, int size);//전체 유저 정보
	void deleteUser(Long userId); 				//삭제 유저
	void updateMembershipLevel(Long userId, String level); //유저 등급 변경.
}