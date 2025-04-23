package com.foodychat.user.vo;

import java.util.List;

import lombok.Data;

@Data
public class CommonCodeSaveVO {
	private CommonCodesVO code;
    private List<CommonCodesVO> details;
}
