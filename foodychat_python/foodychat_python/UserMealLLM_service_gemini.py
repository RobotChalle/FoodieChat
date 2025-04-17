import os
from dotenv import load_dotenv
import time
import requests
from UserMealLLM_models import Meal

# 환경 변수 로드
load_dotenv()

# Gemini API 키 설정
API_KEY = os.getenv("GOOGLE_API_KEY")

def build_prompt(user_query: str, meals: list[Meal]) -> str:
    # 사용자의 식단 정보를 형식화
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

응답은 반드시 아래의 JSON 형식을 정확히 따르세요. 이외의 설명이나 텍스트는 절대 포함하지 마세요.
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

def query_gemini(prompt: str) -> str:
    # Gemini API 엔드포인트 및 API 키
    api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {"parts": [{"text": prompt}]}
        ]
    }

    # API 요청
    response = requests.post(api_url, headers=headers, json=data, params={"key": API_KEY})
    
    # 응답 처리
    if response.status_code == 200:
        result = response.json()
        try:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        except KeyError:
            return "Error: Unexpected response format."
    else:
        return f"Error: {response.status_code}, {response.text}"
