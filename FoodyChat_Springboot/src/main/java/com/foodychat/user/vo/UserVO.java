package com.foodychat.user.vo;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 사용자 정보 VO 클래스
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVO implements UserDetails {
	private static final long serialVersionUID = 1L;
	
	/* 테이블명 users */
	private long user_id;				// 회원아이디(고유) - 자동세팅
	private String email;				// 이메일(아이디)
	private String google_id;			// 구글아이디
	private String user_password;		// 암호
	private String user_name;			// 회원이름
	private String phone;				// 회원전화번호
	private String membership_level;	// 회원등급
	private String reg_date;			// 가입일시
	private String upd_date;			// 수정일시
	
	/* 테이블명 user_details */
	private String gender;
	private int age;
	private float user_weight;
	private float height;
	private String user_address;
	private String health_goal;
	
	private long login_id;			// 로그인아이디
	private String login_ip;			// 로그인아이피
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
	    return List.of(new SimpleGrantedAuthority("ROLE_" + this.membership_level.toUpperCase()));
	}

	@Override
	public String getUsername() {
	    return this.email;
	}

	@Override
	public String getPassword() {
	    return this.user_password;
	}

	@Override
	public boolean isAccountNonExpired() {
	    return true;
	}

	@Override
	public boolean isAccountNonLocked() {
	    return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
	    return true;
	}

	@Override
	public boolean isEnabled() {
	    return true;
	}
}
