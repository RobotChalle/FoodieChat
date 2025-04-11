// com.foodychat.user.vo.UserDetailsVO.java
package com.foodychat.user.vo;

import lombok.Data;

@Data
public class UserDetailsVO {
	private Integer user_id; // 회원 ID (세션 등에서 가져올 것)
    private String gender;
    private int age;
    private double user_weight;
    private double height;
    private String user_address;
    private String health_goal;
}
