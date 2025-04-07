package com.foodychat.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodychat.user.service.UserService;
import com.foodychat.user.vo.UserVO;

/**
 * 사용자 관리 컨트롤러
 */
@RestController
@RequestMapping("/users")
public class UserController {
	@Autowired
    UserService userService;
	
	/**
     * 특정 사용자 정보 조회
     */
    @GetMapping("/{id}")
    public String getUserById(@PathVariable int id, Model model) {
        UserVO user = userService.getUserById(id);
        model.addAttribute("user", user);
        return "user/userDetail"; 	//userDetail.html 또는 userDetail.jsp 페이지로 이동
    }
}