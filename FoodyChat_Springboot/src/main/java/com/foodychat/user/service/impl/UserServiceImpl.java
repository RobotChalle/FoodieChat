package com.foodychat.user.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.foodychat.user.dao.UserDAO;
import com.foodychat.user.service.UserService;
import com.foodychat.user.vo.UserLogVO;
import com.foodychat.user.vo.UserVO;

/**
 * 사용자 서비스 구현 클래스
 */	
@Service
public class UserServiceImpl implements UserService {
	private final UserDAO userDao;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserDAO userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

	/**
     * 모든 사용자 조회
     */
	@Override
	public UserVO getUserById(long id) {
		return userDao.getUserById(id);
	}
	
	/**
	 * 이메일로 사용자 조회
	 * */
	@Override
	public UserVO getUserByEmail(String email) {
		return userDao.getUserByEmail(email);
	}

	/**
	 * 새로운 비밀번호 암호화 후 저장
	 */
	@Override
	public boolean changePassword(String userEmail, String currentPassword, String newPassword) {
		userEmail = "1";
		UserVO user = userDao.getUserById(Long.parseLong(userEmail));
        if (user == null) return false;

        // 현재 비밀번호 일치 여부 확인
        if (!passwordEncoder.matches(currentPassword, user.getUser_password())) {
            return false;
        }

        // 새 비밀번호 암호화 후 저장
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        user.setUser_password(encodedNewPassword);
        userDao.updatePasswordUser(user);
        
        return true;
	}

	/**
	 * 로그저장
	 * */
	@Override
	public void insertUserLog(UserLogVO log) {
		userDao.insertUserLog(log);
	}

	/**
	 * 마지막로그인 정보 확인
	 * */
	@Override
	public UserLogVO getLastSuccessfulLogByUserId(long user_id) {
		return userDao.getLastSuccessfulLogByUserId(user_id);
	}

	/**
	 * 로그아웃시간 저장
	 * */
	@Override
	public void updateLogoutTime(UserLogVO lastLog) {
		userDao.updateLogoutTime(lastLog);
	}
}