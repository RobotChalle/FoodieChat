package com.foodychat.analyze.vo;

import lombok.Data;

@Data
public class MealRecommendationVO {
    private long user_id;
    private String rec_date; // yyyy-MM-dd
    private String meal_type;
    private String menu;
    private long login_id;
    private String login_ip;
}
