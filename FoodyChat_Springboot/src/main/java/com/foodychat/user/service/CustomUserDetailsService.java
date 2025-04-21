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
    	UserVO user = userDAO.getUserByEmail(email);  // 👈 DAO에 이 메서드가 있어야 해요
    	System.out.println("loadUserByUsername:"+user);
    	
        if (user == null) {
            throw new UsernameNotFoundException("해당 이메일을 가진 사용자를 찾을 수 없습니다: " + email);
        }

        return user;
    }
}