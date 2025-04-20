package com.foodychat.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.foodychat.user.dao.UserDAO;
import com.foodychat.user.vo.UserVO;

@Service
public class CustomUserDetailsService implements UserDetailsService {
	@Autowired
    private UserDAO userDAO; // ✅ 또는 Mapper

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("🔍 [UserDetailsService] 사용자 조회 시도: " + email);

        UserVO user = userDAO.getUserByEmail(email); // userService 대신 직접 DAO 호출
        if (user == null) {
            System.out.println("❌ [UserDetailsService] 유저 없음!");
            throw new UsernameNotFoundException("User not found");
        }

        return user;
    }
}