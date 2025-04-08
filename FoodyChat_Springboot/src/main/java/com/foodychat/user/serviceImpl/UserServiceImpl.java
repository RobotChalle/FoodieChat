package com.foodychat.user.serviceImpl;

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
}
