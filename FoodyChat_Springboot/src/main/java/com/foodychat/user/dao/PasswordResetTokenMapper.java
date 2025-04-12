package com.foodychat.config;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PasswordResetTokenMapper {

    void insertToken(PasswordResetToken tokenVO);

    PasswordResetToken findByToken(String token);

    void deleteToken(String token);
}