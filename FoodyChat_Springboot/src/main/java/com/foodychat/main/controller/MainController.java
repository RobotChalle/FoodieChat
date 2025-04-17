package com.foodychat.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 사용자 관리 컨트롤러
 */

@Controller
public class MainController {
	@GetMapping(value = { "/", "/{path:[^\\.]*}" })
    public String index() {
        return "forward:/index.html";
    }
}