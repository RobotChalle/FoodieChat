package com.foodychat.user.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommonCodesVO {
	private String code_id;
	private String code_name;
	private String detail_code;
	private String detail_name;
	private String reg_id;
	private String reg_date;
	private String upd_id;
	private String upd_date;
	private long login_id;			// 로그인아이디
	private String login_ip;			// 로그인아이피
}