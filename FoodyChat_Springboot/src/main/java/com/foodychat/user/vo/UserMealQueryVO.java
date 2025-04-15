package com.foodychat.user.vo;

import java.util.List;

import lombok.Data;

@Data
public class UserMealQueryVO {
	private String userQuery;
    private List<UserMealsVO> meals;
}
