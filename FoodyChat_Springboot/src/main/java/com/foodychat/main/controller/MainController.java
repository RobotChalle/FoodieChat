package com.foodychat.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 사용자 관리 컨트롤러
 */
@Controller
public class MainController {
    // 모든 /foodychat 하위 경로를 React index.html로 forward
	@GetMapping(value = {
	    "/foodychat",
	    "/foodychat/{path:[^\\.]*}",
	    "/foodychat/{path:^(?!static|api|assets).*}"
	})
    public String forwardReactRoutes() {
        return "forward:/index.html";  // ❗ static/index.html 이 아님
    }
}