# foodychat_python/router/meal_summary_router.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
from meal_summary_gemini_client import call_gemini

router = APIRouter()

class Meal(BaseModel):
    meal_date: str
    meal_type_nm: str
    meal_text: str

class MealSummaryResponse(BaseModel):
    summary: str

@router.post("/meal/summary", response_model=MealSummaryResponse)
async def meal_summary(meals: List[Meal]):
    """
    ✅ meals 배열을 바로 받는 FastAPI 엔드포인트
    """
    if not meals:
        return {"summary": "식단 데이터가 없습니다."}

    # meal list -> prompt 텍스트로 변환
    meal_texts = [f"{meal.meal_date} - {meal.meal_type_nm}: {meal.meal_text}" for meal in meals]
    prompt = (
        "다음은 사용자의 식단 데이터입니다.\n"
        "이 데이터를 기반으로 전체 식단의 특징을 분석하고, 자연스러운 문장으로 2~3문장 정도 요약해줘.\n\n"
        + "\n".join(meal_texts)
    )

    try:
        summary = await call_gemini(prompt)
        return {"summary": summary.strip()}
    except Exception as e:
        print(f"❌ Gemini 호출 실패: {e}")
        return {"summary": "요약 생성에 실패했습니다."}