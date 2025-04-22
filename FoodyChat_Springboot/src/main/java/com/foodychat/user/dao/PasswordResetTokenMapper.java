package com.foodychat.user.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.foodychat.user.vo.PasswordResetToken;

@Mapper
public interface PasswordResetTokenMapper {

    void insertToken(PasswordResetToken tokenVO);

    PasswordResetToken findByToken(@Param("token") String token);

    void deleteToken(@Param("token") String token);
}