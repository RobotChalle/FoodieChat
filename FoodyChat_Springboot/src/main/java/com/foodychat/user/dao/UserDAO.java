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
	 * ID로 사용자 조회
	 * */
	public UserVO getUserById(long id) {
		return sqlSession.selectOne(mapperQuery + ".selectUserById", id);
	}
	
	/**
	 * 이메일로 사용자 조회
	 * */
	public UserVO getUserByEmail(String email) {
		return sqlSession.selectOne(mapperQuery + ".selectUserByEmail", email);
	}

	public void updatePasswordUser(UserVO user) {
		sqlSession.update(mapperQuery + ".updatePasswordUser", user);
	}
}