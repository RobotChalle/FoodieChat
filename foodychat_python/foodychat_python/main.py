import uvicorn
from fastapi import FastAPI, File, UploadFile
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

if not os.path.exists("temp"):
    os.makedirs("temp")

app = FastAPI()

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

    
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)