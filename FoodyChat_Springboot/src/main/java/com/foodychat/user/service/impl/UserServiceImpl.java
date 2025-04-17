package com.foodychat.user.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.foodychat.user.dao.PasswordResetTokenMapper;
import com.foodychat.user.dao.UserDAO;
import com.foodychat.user.service.UserService;
import com.foodychat.user.vo.BmiHistoryVO;
import com.foodychat.user.vo.FoodRecognitionHistoryVO;
import com.foodychat.user.vo.PasswordResetToken;
import com.foodychat.user.vo.UserDetailsVO;
import com.foodychat.user.vo.UserLogVO;
import com.foodychat.user.vo.UserMealsVO;
import com.foodychat.user.vo.UserVO;

/**
 * 사용자 서비스 구현 클래스
 */	
@Service
public class UserServiceImpl implements UserService {
	private final UserDAO userDao;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenMapper tokenMapper;

    public UserServiceImpl(UserDAO userDao, PasswordEncoder passwordEncoder, PasswordResetTokenMapper tokenMapper) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
        this.tokenMapper = tokenMapper;
    }
	
    @Override
    public void registerUser(UserVO userVO) {
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(userVO.getUser_password());
        userVO.setUser_password(encodedPassword);

        userDao.insertUser(userVO); // DB 저장
    }

    @Override
    public void registerGoogleUser(UserVO user) {
        userDao.insertGoogleUser(user);
    }
    @Override
    public void saveUserDetails(UserDetailsVO details) {
        userDao.insertUserDetails(details);
    }
    @Override
    public List<UserVO> getUserList(int page, int size) {
        int offset = (page - 1) * size;
        return userDao.getUserList(size, offset);
    }
    @Override
    public int getTotalUserCount() {
        return userDao.getTotalUserCount();
    }
    @Override
    public void deleteUser(Long userId) {
    	
        userDao.deleteUser(userId);
    }
    @Override
    public void updateMembershipLevel(Long userId, String level) {
        userDao.updateMembershipLevel(userId, level);
    }
	/**
     * 모든 사용자 조회
     */
	@Override
	public UserVO getUserById(long id) {
		return userDao.getUserById(id);
	}

	/**
     * 유저 int id로 조회
     */
	@Override
	public UserVO getUserInfoByUserId(int userId) {
    	return userDao.selectUserByUserId(userId);
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
		//userEmail = "1";
		UserVO user = userDao.getUserByEmail(userEmail);
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

	/**
	 * 회원정보 수정
	 * */
	@Override
	public void updateUser(UserVO updatedUser) {
		userDao.updateUser(updatedUser);
	}

	/**
	 * 회원상세정보 수정
	 * */
	@Override
	public void updateUserDetail(UserVO updatedUser) {
		userDao.updateUserDetail(updatedUser);
	}

	/**
	 * 회원상세정보 존재여부
	 * */
	@Override
	public UserVO getUserDetailById(long user_id) {
		return userDao.getUserDetailById(user_id);
	}

	/**
	 * 회원상세정보 등록
	 * */
	@Override
	public void insertUserDetail(UserVO updatedUser) {
		userDao.insertUserDetail(updatedUser);
	}

	/**
	 * 이름, 전화번호로 아이디찾기
	 * */
	@Override
	public String getIdByNameAndPhone(String userName, String phone) {
		Map<String,String> map = new HashMap<String,String>();
		map.put("user_name", userName);
		map.put("phone", phone);
		return userDao.getIdByNameAndPhone(map);
	}
	
	/**
	 * 유저정보 validation
	 * */
	@Override
    public boolean validateUserInfo(String email) {
        UserVO user = userDao.getUserByEmail(email);
        return user != null &&
               user.getEmail().equals(email);
    }

	/**
	 * 비밀번호 초기화
	 * */
    @Override
    public void savePasswordResetToken(String email, String token) {
        UserVO user = userDao.getUserByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        PasswordResetToken tokenVO = new PasswordResetToken();
        tokenVO.setToken(token);
        tokenVO.setEmail(email);
        tokenVO.setExpiryDate(LocalDateTime.now().plusHours(1));
        tokenVO.setUserId(user.getUser_id());

        tokenMapper.insertToken(tokenVO);
    }

    @Override
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
    	PasswordResetToken tokenVO = tokenMapper.findByToken(token);
        if (tokenVO == null || tokenVO.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        Map<String,String> map = new HashMap<String,String>();
		map.put("email", tokenVO.getEmail());
		map.put("password", passwordEncoder.encode(newPassword));
        userDao.updateUserPasswordByEmail(map);
        tokenMapper.deleteToken(token);
        return true;
    }
    
    /**
	 * 회원 식단정보 가져오기
	 * */
    public List<UserMealsVO> getMeals(long user_id) {
        return userDao.getMeals(user_id);
    }

    /**
	 * 이메일 중복 여부 확인 (회원가입 시 중복 방지용)
	 */
	@Override
	public boolean isEmailExists(String email) {
	    return userDao.isEmailExists(email);  // 정확한 메서드 이름 사용 확인
	}

	//BMI 히스토리 
	@Override
	public List<BmiHistoryVO> getBmiHistory(Long userId) {
    	return userDao.selectBmiHistoryByUserId(userId);
	}
	//음식 히스토리 
	@Override
	public List<FoodRecognitionHistoryVO> getFoodHistory(Long userId) {
    	return userDao.selectFoodHistoryByUserId(userId);
	}
}