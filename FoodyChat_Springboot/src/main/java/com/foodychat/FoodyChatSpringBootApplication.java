// FoodyChatApplication.java
package com.foodychat;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.foodychat.user.dao") // 여기에 Mapper 경로 추가
public class FoodyChatSpringBootApplication {
	public static void main(String[] args) {
		SpringApplication.run(FoodyChatSpringBootApplication.class, args);
	}
}
