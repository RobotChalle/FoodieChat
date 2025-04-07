package com.foodychat.chat.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * 사용자 DAO (MyBatis)
 */
@Repository
public class ChatDAO {
	private static String mapperQuery = "com.foodychat.chat.dao.ChatDAO";

    @Autowired
    private SqlSession sqlSession;
}