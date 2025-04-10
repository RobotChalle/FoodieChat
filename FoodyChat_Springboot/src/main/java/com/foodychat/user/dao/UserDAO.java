package com.foodychat.user.dao;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.foodychat.user.vo.UserLogVO;
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
	
	/**
	 * 비밀번호 변경
	 * */
	public void updatePasswordUser(UserVO user) {
		sqlSession.update(mapperQuery + ".updatePasswordUser", user);
	}
	
	/**
	 * 로그저장
	 * */
	public void insertUserLog(UserLogVO log) {
		sqlSession.insert(mapperQuery + ".insertUserLog", log);
	}

	/**
	 * 마지막로그인 정보 확인
	 * */
	public UserLogVO getLastSuccessfulLogByUserId(long user_id) {
		return sqlSession.selectOne(mapperQuery + ".selectLastSuccessfulLogByUserId", user_id);
	}

	/**
	 * 로그아웃시간 저장
	 * */
	public void updateLogoutTime(UserLogVO lastLog) {
		sqlSession.update(mapperQuery + ".updateLogoutTime", lastLog);
	}

	/**
	 * 회원정보 수정
	 * */
	public void updateUser(UserVO updatedUser) {
		sqlSession.update(mapperQuery + ".updateUser", updatedUser);
	}

	/**
	 * 회원상세정보 수정
	 * */
	public void updateUserDetail(UserVO updatedUser) {
		sqlSession.update(mapperQuery + ".updateUserDetail", updatedUser);
	}

	/**
	 * 회원상세정보 존재여부
	 * */
	public UserVO getUserDetailById(long user_id) {
		return sqlSession.selectOne(mapperQuery + ".getUserDetailById", user_id);
	}

	/**
	 * 회원상세정보 등록
	 * */
	public void insertUserDetail(UserVO updatedUser) {
		sqlSession.insert(mapperQuery + ".insertUserDetail", updatedUser);
	}

	/**
	 * 이름, 전화번호로 아이디찾기
	 * */
	public String getIdByNameAndPhone(Map<String, String> map) {
		return sqlSession.selectOne(mapperQuery + ".selectIdByNameAndPhone", map);
	}

	/**
	 * 비밀번호 변경
	 * */
	public void updateUserPasswordByEmail(Map<String, String> map) {
		sqlSession.update(mapperQuery + ".updateUserPasswordByEmail", map);
	}
}