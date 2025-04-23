import openai
from dotenv import load_dotenv
import os
from UserMealLLM_models import Meal
import time

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def build_prompt(user_query: str, enriched_meals: list[dict], response_type: str) -> str:
    meal_lines = "\n".join([
        f"{meal['meal_date']} | {meal['meal_type_nm']} | {meal['meal_text']} | 칼로리: {meal['calories']}kcal | 탄수: {meal['carb']}g | 단백질: {meal['protein']}g | 지방: {meal['fat']}g"
        for meal in enriched_meals
    ])

    prompt = f"""
사용자의 자연어 명령: "{user_query}"

예측된 시각화 타입은 "{response_type}"입니다.

아래는 사용자의 식단 데이터입니다:
날짜 | 구분 | 식단 | 칼로리 | 탄수 | 단백질 | 지방
{meal_lines}

"{response_type}" 형식에 맞는 식단만 추출해서 filteredMeals로 반환해주세요. 응답은 아래 JSON 형식으로만 주세요:

{{
  "type": "{response_type}",
  "filteredMeals": [
    {{
      "meal_date": "2025-04-01",
      "meal_type_nm": "조식",
      "meal_text": "계란후라이, 밥, 김치",
      "calories": 600,
      "carb": 70,
      "protein": 20,
      "fat": 15
    }}
  ]
}}
"""
    return prompt

def query_openai(prompt: str) -> str:
    start = time.time()
    response = openai.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=[
          {"role": "system", "content": "당신은 식단 데이터를 분석하고 시각화 타입을 제안하는 전문가입니다."},
          {"role": "user", "content": prompt}
      ],
      temperature=0.3
    )
    end = time.time()
    print("⏱️ GPT 처리 시간:", end - start, "초")
    return response.choices[0].message.content
