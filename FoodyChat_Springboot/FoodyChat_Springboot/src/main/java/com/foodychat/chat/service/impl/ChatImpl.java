package com.foodychat.chat.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foodychat.chat.dao.ChatDAO;
import com.foodychat.chat.service.ChatService;

/**
 * 사용자 서비스 구현 클래스
 */	
@Service
public class ChatImpl implements ChatService {
	@Autowired
    ChatDAO chatDao;
}