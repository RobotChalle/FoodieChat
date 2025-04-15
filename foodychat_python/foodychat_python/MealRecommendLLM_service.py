from dotenv import load_dotenv
from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
import re

load_dotenv()

def build_recommend_prompt(start: str, 
                           end: str, 
                           types: str, 
                           health_goal: str,
                           age: int,
                           height: float,
                           user_weight: float,
                           gender:str) -> str:
    # 영문 → 한글 변환 맵
    meal_type_map = {
        'breakfast': '조식',
        'lunch': '중식',
        'dinner': '석식'
    }

    # 사용자가 선택한 식사 구분들만 추출
    selected_types = types.split(',') if types else []
    selected_korean = [meal_type_map.get(t) for t in selected_types if t in meal_type_map]

    if not selected_korean:
        return "⚠️ 식사 구분이 지정되지 않았습니다. 조식, 중식, 석식 중 하나 이상을 선택해주세요."

    meal_labels = ', '.join(selected_korean)
    
    # ✅ 성별 변환: 1 → 남성, 그 외 → 여성
    gender_korean = "남성" if gender == "1" else "여성"

    # 프롬프트 생성
    prompt = f"""
당신은 영양학 전문가입니다. 아래 사용자 정보를 바탕으로 {start}부터 {end}까지 날짜별 '{meal_labels}'에 해당하는 건강한 식단을 추천해주세요.

✅ 사용자 정보:
- 건강 목표: {health_goal}
- 성별 : {gender_korean}
- 나이: {age}세
- 키: {height}cm
- 몸무게: {user_weight}kg

각 날짜마다 {meal_labels} 식사 시간에 맞는 식단을 추천해주세요.
출력은 아래와 같이 '날짜 | 식사구분 | 추천메뉴' 표 형식으로 작성해주세요:

날짜 | 식사구분 | 추천메뉴
----------------------------
2025-04-15 | 조식 | 귀리죽, 삶은 달걀
2025-04-15 | 중식 | 닭가슴살 샐러드, 우유
2025-04-15 | 석식 | 연어구이와 현미밥
...
"""
    return prompt

def query_recommend_gemini(prompt: str) -> str:
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
    
def query_recommend_parser(result_text):
    # 간단한 파싱 예시 (실제 프로젝트에서는 좀 더 robust한 파서 사용 권장)
    parsed = []
    lines = result_text.strip().splitlines()

    for line in lines:
        # 데이터 줄만 추출 (날짜 | 식사구분 | 메뉴)
        match = re.match(r"^\s*\|?\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|?\s*$", line)
        if match:
            date, mtype, menu = match.groups()
            parsed.append({
                "date": date.strip(),
                "type": mtype.strip(),
                "menu": menu.strip()
            })

    return {"result": parsed}
