package com.foodychat.analyze.vo;

import lombok.Data;

/**
 * 사용자 정보 VO 클래스
 */
@Data
//@NoArgsConstructor
//@AllArgsConstructor
public class AnalyzeVO {
	/**입력 필요*/
	private float calories;
	private float nut_carb;
	private float nut_pro;
	private float nut_fat;
	private String food_name;
	private String food_ko_name;
}
