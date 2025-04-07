package com.foodychat.analyze.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * 사용자 DAO (MyBatis)
 */
@Repository
public class AnalyzeDAO {
	private static String mapperQuery = "com.foodychat.analyze.dao.AnalyzeDAO";

    @Autowired
    private SqlSession sqlSession;
}