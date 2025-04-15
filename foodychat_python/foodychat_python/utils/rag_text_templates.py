def generate_rag_text(user: dict, bmis: list, foods: list) -> str:
    lines = []
    lines.append("[사용자 정보]")
    lines.append(f"- 성별: {'남성' if user.gender == 1 else '여성'}")
    lines.append(f"- 나이: {user.age}세")
    lines.append(f"- 키: {user.height}cm")
    lines.append(f"- 몸무게: {user.user_weight}kg")
    lines.append(f"- 건강 목표: {goal_to_string(user.health_goal)}")
    if user.user_address:
        lines.append(f"- 주소: {user.user_address}")

    lines.append("\n[최근 BMI 기록]")
    for bmi in bmis:
        lines.append(f"{bmi.reg_date.date()} - BMI: {bmi.bmi_score} "
                     f"(몸무게: {bmi.user_weight}kg / 키: {bmi.height}cm)")

    lines.append("\n[최근 업로드 음식]")
    for food in foods:
        lines.append(f"{food.created_at.date()} - {food.food_name} ({food.calories} kcal)")

    return "\n".join(lines)

def goal_to_string(code: int):
    return {
        1: "체중 감량",
        2: "체중 유지",
        3: "체중 증가"
    }.get(code, "기타")
