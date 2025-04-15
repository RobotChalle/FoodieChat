import openai
from dotenv import load_dotenv
import os
from UserMealLLM_models import Meal
import time

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def build_prompt(user_query: str, meals: list[Meal]) -> str:
    meal_lines = "\n".join([
        f"{meal.meal_date} | {meal.meal_type_nm} | {meal.meal_text}"
        for meal in meals
    ])

    prompt = f"""
사용자의 자연어 명령: "{user_query}"

아래는 사용자의 식단 데이터입니다:
날짜 | 구분 | 식단
{meal_lines}

명령을 분석하여 다음 중 하나를 JSON 형식으로 응답하세요:
- type: "table" 또는 "calendar"
- filteredMeals: 해당 조건에 맞는 식단 목록

응답 예시:
{{
  "type": "calendar",
  "filteredMeals": [
    {{
      "meal_date": "2025-03-10",
      "meal_type_nm": "중식",
      "meal_text": "닭갈비, 샐러드"
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
