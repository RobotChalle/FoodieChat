package com.foodychat.user.vo;

import lombok.Data;

@Data
public class UserLogVO {
    private Long id;
    private Long userId;
    private String loginTime;
    private String logoutTime;
    private String ipAddress;
    private String userAgent;
    private String loginStatus;
    private String failureReason;
    private String regDate;
}