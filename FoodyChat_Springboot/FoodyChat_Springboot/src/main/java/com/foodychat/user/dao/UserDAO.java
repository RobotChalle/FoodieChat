package com.foodychat.user.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.foodychat.user.vo.UserVO;

/**
 * 사용자 DAO (MyBatis)
 */
@Repository
public class UserDAO {
	private static String mapperQuery = "com.foodychat.user.dao.UserDAO";

    @Autowired
    private SqlSession sqlSession;

    /**
     * 특정 사용자 조회
     */
    public UserVO getUserById(int id) {
        return sqlSession.selectOne(mapperQuery + ".selectUserById", id);
    }
}