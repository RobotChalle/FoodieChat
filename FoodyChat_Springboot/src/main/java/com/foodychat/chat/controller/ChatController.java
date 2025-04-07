package com.foodychat.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodychat.chat.service.ChatService;

/**
 * 챗봇 관리 컨트롤러
 */
@RestController
@RequestMapping("/chat")
public class ChatController {
	@Autowired
    ChatService chatService;
}