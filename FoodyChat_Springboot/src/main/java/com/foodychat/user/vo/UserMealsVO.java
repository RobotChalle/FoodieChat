package com.foodychat.user.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 사용자 정보 VO 클래스
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserMealsVO {
	/* 테이블명 user_meals */
	private long user_id;				// 회원아이디(고유) - 자동세팅
	private String email;				// 이메일(아이디)
	private String google_id;			// 구글아이디
	private String user_name;			// 회원이름
	private String meal_date;			// 날짜
	private String meal_type;			// 구분코드(1:조식, 2:중식, 3:석식)
	private String meal_type_nm;		// 구분코드명
	private String meal_text;			// 식단
	private String membership_level;	// 회원등급
	private String login_id;			// 로그인아이디
	private String login_ip;			// 로그인아이피
}
