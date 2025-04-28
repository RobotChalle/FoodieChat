# foodychat_python/services/llm_service.py
from meal_summary_gemini_client import call_gemini

async def get_meal_summary_from_llm(meals):
    meal_texts = [f"{meal.meal_date} - {meal.meal_type_nm}: {meal.meal_text}" for meal in meals]
    prompt = (
        "다음 식단 데이터들을 기반으로 한달 식단의 특징을 분석하고, "
        "2~3문장 정도로 자연스럽게 요약해줘:\n\n"
        + "\n".join(meal_texts)
    )
    result = await call_gemini(prompt)
    return result.strip()