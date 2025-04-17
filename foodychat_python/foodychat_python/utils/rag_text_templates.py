from typing import List
from datetime import datetime
from models.schemas import FullUserProfileSchema, BMISchema, MealSchema

# 사용자 정보 기반 텍스트 생성
def build_user_profile_text(user_data: FullUserProfileSchema) -> str:
    user_details = user_data.user_details
    gender_str = "남성" if user_details.gender == 1 else "여성" if user_details.gender == 2 else "기타"
    
    return f"""
사용자 이름: {user_details.user_name or '이름없음'}
성별: {gender_str}
나이: {user_details.age}세
키: {user_details.height} cm
몸무게: {user_details.user_weight} kg
건강 목표: {user_details.health_goal or '없음'}
""".strip()


# 최근 BMI 기록을 포함한 설명 텍스트
def build_bmi_text(latest_bmi: BMISchema | None) -> str:
    if latest_bmi:
        reg_date = latest_bmi.reg_date.strftime("%Y-%m-%d")
        bmi_score = round(latest_bmi.bmi_score, 2)
        return f"가장 최근 BMI는 {bmi_score}이며, 측정일은 {reg_date}입니다."
    return "최근 BMI 기록이 없습니다."


# 최근 음식 기록을 포함한 설명 텍스트
def build_food_history_text(meals: List[MealSchema]) -> str:
    if not meals:
        return "최근 음식 기록이 없습니다."

    food_items = "\n".join(
        f"- {meal.food_name} ({meal.calories} kcal, {meal.created_at.strftime('%Y-%m-%d')})"
        for meal in meals
    )

    return f"""
최근 사용자가 섭취한 음식 기록입니다:
{food_items}
""".strip()


# 전체 RAG 텍스트 생성 (유저 정보 + BMI + 음식 기록)
def build_full_rag_text(user_data: FullUserProfileSchema) -> str:
    profile_text = build_user_profile_text(user_data)
    bmi_text = build_bmi_text(user_data.latest_bmi)
    food_text = build_food_history_text(user_data.meals)

    combined_text = f"""
당신은 전문적인 건강 상담가입니다.

다음은 한 사용자의 건강 프로필과 최근 BMI 및 식습관 기록입니다. 
이 정보를 바탕으로 사용자의 건강에 대한 전반적인 상태를 이해하고, 
상담을 통해 적절한 조언을 제공해주세요.

사용자는 건강, 몸 상태, 생활 습관 등에 대한 다양한 고민을 가지고 있으며, 
당신은 그 고민을 공감하고, 사용자에게 도움이 되는 실질적인 건강 조언을 제공하는 역할입니다.

---

### [사용자 건강 프로필 요약]
{profile_text}

### [최근 BMI 기록]
{bmi_text}

### [최근 섭취 음식 기록]
{food_text}

---

유의사항:
- 최근 섭취 음식 기록이 unknown이거나 , 최근 BMI 기록이 0이면 각각의 기록을 무시하세요.
- 사용자의 건강 목표(예: 체중 감량, 근육 증가 등)에 따라 조언의 방향을 맞춰주세요.
- 식단을 직접 추천하지 않아도 됩니다.
- 대신, 생활 습관 개선, 수면, 스트레스, 운동, 소화 문제 등 사용자의 질문에 맞는 **포괄적인 건강 조언**을 해주세요.
- 전문적이되 따뜻하고 친절한 말투로 응답해주세요.
- 

이제, 사용자의 질문에 대해 전문적인 건강 상담을 시작해주세요.
""".strip()

    return combined_text
