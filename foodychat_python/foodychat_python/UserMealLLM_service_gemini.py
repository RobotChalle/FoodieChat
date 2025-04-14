import openai
from dotenv import load_dotenv
import os
from UserMealLLM_models import Meal
import time
import requests

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

def query_openai(prompt: str) -> str:
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDPr7KPl7PZT9pnW-_fzA23ui6pOHnehwE"
    api_header = {"Content-Type": "application/json"}
    response = requests.post(api_url, headers=api_header, json=data)
    
    if response.status_code == 200:
        result = response.json()
        try:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        except KeyError:
            return "Error: Unexpected response format."
    else:
        return f"Error: {response.status_code}, {response.text}"
