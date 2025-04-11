package com.foodychat.user.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.foodychat.user.dao.UserDAO;
import com.foodychat.user.service.UserService;
import com.foodychat.user.vo.UserDetailsVO;
import com.foodychat.user.vo.UserVO;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void registerUser(UserVO userVO) {
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(userVO.getUser_password());
        userVO.setUser_password(encodedPassword);

        userDAO.insertUser(userVO); // DB 저장
    }

    @Override
    public void registerGoogleUser(UserVO user) {
        userDAO.insertGoogleUser(user);
    }

    @Override
    public UserVO getUserByEmail(String email) {
        return userDAO.findByEmail(email);
    }
    @Override
    public void saveUserDetails(UserDetailsVO details) {
        userDAO.insertUserDetails(details);
    }
    @Override
    public List<UserVO> getUserList(int page, int size) {
        int offset = (page - 1) * size;
        return userDAO.getUserList(size, offset);
    }
    @Override
    public int getTotalUserCount() {
        return userDAO.getTotalUserCount();
    }
    @Override
    public void deleteUser(Long userId) {
    	
        userDAO.deleteUser(userId);
    }
    @Override
    public void updateMembershipLevel(Long userId, String level) {
        userDAO.updateMembershipLevel(userId, level);
    }
}
