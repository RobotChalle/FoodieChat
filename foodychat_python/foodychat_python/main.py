import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from UserMealLLM_models import MealQueryRequest
from UserMealLLM_service_gemini import build_prompt, query_openai
from MealRecommendLLM_models import MealRequest
from MealRecommendLLM_service import build_recommend_prompt, query_recommend_gemini, query_recommend_parser
from CafeRecommendLLM_models import Store, StoreRequest
from CafeRecommendLLM_service import build_cafe_recommend_prompt, query_cafe_recommend_gemini
import json
import re
import requests
from fastapi.responses import JSONResponse
import torch
from torchvision import transforms
from PIL import Image
import os
import shutil
from predict import predict_food
import uuid
from router import chat_router  # chat_router에서 FastAPI 라우터 가져오기
from services.rag_service import generate_answer_from_gemini  # 정확한 함수 이름 사용
from pydantic import BaseModel

if not os.path.exists("temp"):
    os.makedirs("temp")

app = FastAPI()

#라우터 
app.include_router(chat_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_json_block(text: str) -> str:
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        return match.group(0)
    return text  # fallback: return original

@app.post("/query")
async def query_llm(request: MealQueryRequest):
    prompt = build_prompt(request.query, request.meals)
    response_str = query_openai(prompt)
    print("🔍 LLM 응답 원본:\n", response_str)

    try:
        clean_json_str = extract_json_block(response_str)
        json_obj = json.loads(clean_json_str)
        return JSONResponse(content=json_obj)
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"error": f"LLM 응답 파싱 실패: {str(e)}", "llm_response": response_str}
        )
        
@app.get("/recommend")
async def recommend(
                        start: str,
                        end: str,
                        types: str,
                        health_goal: str,
                        age: int,
                        height: float,
                        user_weight: float,
                        gender:str
                    ):
    prompt = build_recommend_prompt(
        start=start,
        end=end,
        types=types,
        health_goal=health_goal,
        age=age,
        height=height,
        user_weight=user_weight,
        gender=gender
    )

    result_text = query_recommend_gemini(prompt)
    print("🔍 LLM 응답 원본:\n", result_text)
    return query_recommend_parser(result_text)  # ✅

@app.post("/cafe-recommend")
async def cafe_recommend(req: StoreRequest):
    prompt = build_cafe_recommend_prompt(req.food, req.location, req.stores)
    result = query_cafe_recommend_gemini(prompt)
    print("🔍 Gemini 응답:\n", result)
    return {"summary": result}

@app.post("/predict")
async def analyze_image(file: UploadFile = File(...)):
    file_path = f"temp/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict_food(file_path)
    return result

# MealQueryRequest 모델 정의 (user_id는 필수로 지정)
class MealQueryRequest(BaseModel):
    user_id: int  # 필수로 user_id가 필요합니다
    question: str = None  # 챗봇 대화 시 사용
    query: str = None     # RAG 생성 시 사용

    # 데이터 유효성 검사
    def validate(self):
        if not self.user_id:
            raise HTTPException(status_code=422, detail="user_id는 필수입니다.")
        if not (self.question or self.query):
            raise HTTPException(status_code=422, detail="question 또는 query는 필수입니다.")

# Helper function to extract JSON from string response
def extract_json_block(text: str) -> str:
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        return match.group(0)
    return text  # fallback: return original

    
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)