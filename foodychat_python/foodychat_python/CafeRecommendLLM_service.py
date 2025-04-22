from dotenv import load_dotenv
from fastapi import FastAPI, Query
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from CafeRecommendLLM_models import Store
import requests
import os
import re

load_dotenv()

def build_cafe_recommend_prompt(food: str, location: str, stores: List[Store]) -> str:
    prompt = f"""
당신은 맛집 추천 전문가입니다.

아래는 '{location}' 지역의 '{food}' 관련 식당 정보입니다.
사용자가 1~2곳을 선택할 수 있도록 평점과 리뷰를 참고해 간결하게 추천 문장을 작성해주세요.

- 신뢰도 있는 말투
- 2~3줄 이내로 요약
- 식당명, 특징(리뷰 기반), 위치 강조

식당 목록:
"""

    for idx, store in enumerate(stores, start=1):
        prompt += f"{idx}. {store.name} | {store.real_address} | 평점: {store.rating} | 리뷰: {store.review}\n"

    return prompt

def query_cafe_recommend_gemini(prompt: str) -> str:
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