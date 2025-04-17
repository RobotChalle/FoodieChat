package com.foodychat.user.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BmiHistoryVO {
    private Long id;
    private Long userId;
    private Double bmiScore;
    private Integer gender;
    private Double userWeight;
    private Double height;
    private LocalDateTime regDate;
    private LocalDateTime updDate;
}
