// FoodyChatApplication.java
package com.foodychat;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@MapperScan(basePackages = "com.foodychat.user.dao")
public class FoodyChatSpringBootApplication {
	public static void main(String[] args) {
		SpringApplication.run(FoodyChatSpringBootApplication.class, args);
	}
}
