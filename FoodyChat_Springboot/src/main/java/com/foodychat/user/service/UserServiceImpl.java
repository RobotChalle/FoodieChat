package com.foodychat.user.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foodychat.user.dao.UserDAO;
import com.foodychat.user.service.UserService;
import com.foodychat.user.vo.UserVO;

/**
 * 사용자 서비스 구현 클래스
 */	
@Service
public class UserServiceImpl implements UserService {
	@Autowired
    UserDAO userDao;

	/**
     * 모든 사용자 조회
     */
	@Override
	public UserVO getUserById(int id) {
		return userDao.getUserById(id);
	}
}