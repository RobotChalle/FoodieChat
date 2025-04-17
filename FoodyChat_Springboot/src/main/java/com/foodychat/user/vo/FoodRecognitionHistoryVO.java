package com.foodychat.user.vo;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FoodRecognitionHistoryVO {
    private Long id;
    private Long userId;
    private Long foodId;
    private String recDate;
    private String mealType;  // enum('1','2','3') → 아침/점심/저녁 매핑은 서비스에서 처리
    private String imagePath;
    private LocalDateTime regDate;
    private LocalDateTime updDate;
}
