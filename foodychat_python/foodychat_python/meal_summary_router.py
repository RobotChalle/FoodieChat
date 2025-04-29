from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from meal_summary_gemini_client import call_gemini
import json

router = APIRouter()

class Meal(BaseModel):
    meal_date: str
    meal_type_nm: str
    meal_text: str

class MealSummaryResponse(BaseModel):
    summary: str
    total_calories: Optional[int] = 0
    total_carb: Optional[int] = 0
    total_protein: Optional[int] = 0
    total_fat: Optional[int] = 0

@router.post("/meal/summary", response_model=MealSummaryResponse)
async def meal_summary(meals: List[Meal]):
    if not meals:
        return {
            "summary": "식단 데이터가 없습니다.",
            "total_calories": 0,
            "total_carb": 0,
            "total_protein": 0,
            "total_fat": 0
        }

    meal_texts = [f"{meal.meal_date} - {meal.meal_type_nm}: {meal.meal_text}" for meal in meals]
    
    prompt = (
        "다음은 사용자의 식단 데이터입니다.\n"
        "이 데이터를 기반으로 식단을 요약해주세요.\n"
        "\n"
        "요약은 반드시 다음 항목을 포함하고, 각각 **별도의 문단(줄바꿈)** 으로 작성해 주세요:\n"
        "1. 전체적인 식습관의 특징\n"
        "2. 긍정적인 점\n"
        "3. 개선할 점\n"
        "4. 건강을 위한 조언\n"
        "\n"
        "각 문단은 간결한 제목(예: 특징, 긍정적 요소, 개선 포인트, 건강 조언)으로 시작해 주세요.\n"
        "각 문단은 2~4줄 정도 길이로 자연스럽게 작성해 주세요.\n"
        "\n"
        "📌 반드시 아래 JSON 형식으로 응답해 주세요:\n"
        "{\n"
        "\"summary\": \"[300자 이상 길고 문단 구분된 텍스트]\",\n"
        "\"total_calories\": 숫자,\n"
        "\"total_carb\": 숫자,\n"
        "\"total_protein\": 숫자,\n"
        "\"total_fat\": 숫자\n"
        "}\n"
        "\n"
        "식단 데이터:\n" + "\n".join(meal_texts)
    )

    try:
        result_text = await call_gemini(prompt)

        if not result_text or not result_text.strip():
            raise ValueError("Gemini 결과가 비어있습니다.")

        # ✅ 응답이 ```json\n{ ... }\n``` 형태면, 코드블럭 제거
        if result_text.startswith("```json"):
            result_text = result_text.strip()
            result_text = result_text.removeprefix("```json").removesuffix("```").strip()

        # ✅ 이제 json.loads 가능
        result_json = json.loads(result_text)
        return result_json

    except Exception as e:
        print(f"❌ Gemini 호출 실패: {e}")
        return {
            "summary": "요약 생성에 실패했습니다.",
            "total_calories": 0,
            "total_carb": 0,
            "total_protein": 0,
            "total_fat": 0
        }
