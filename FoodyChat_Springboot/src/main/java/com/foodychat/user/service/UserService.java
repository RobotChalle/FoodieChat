package com.foodychat.user.service;

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
	 * 
	 * @param userEmail 로그인된 이메일
	 * @param currentPassword 현재비밀번호
	 * @param newPassword 새로운비밀번호
	 * @return
	 */
	boolean changePassword(String userEmail, String currentPassword, String newPassword);
}
