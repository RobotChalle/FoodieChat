package com.foodychat.user.service;

import org.springframework.stereotype.Repository;

import com.foodychat.user.vo.UserVO;

/**
 * 사용자 서비스 클래스
 */
@Repository
public interface UserService {

	/**
     * 모든 사용자 조회
     */
	UserVO getUserById(int id);

}
