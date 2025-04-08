package com.foodychat.user.dao;

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
}