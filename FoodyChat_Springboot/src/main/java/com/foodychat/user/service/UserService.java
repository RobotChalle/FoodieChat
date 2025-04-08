package com.foodychat.user.service;
import com.foodychat.user.vo.UserDetailsVO;
import com.foodychat.user.vo.UserVO;


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
    void registerUser(UserVO user);           // 일반 회원가입
    void registerGoogleUser(UserVO user);     // 구글 회원가입
    UserVO getUserByEmail(String email);	//유저 정보 가져오기
    void saveUserDetails(UserDetailsVO details); //회원가입시 상세정보 입력.
}