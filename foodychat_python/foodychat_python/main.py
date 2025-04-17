from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import json
import re
from fastapi.middleware.cors import CORSMiddleware
from router import chat_router  # chat_router에서 FastAPI 라우터 가져오기
from services.rag_service import generate_answer_from_gemini  # 정확한 함수 이름 사용

# FastAPI 앱 생성
app = FastAPI()

#라우터 
app.include_router(chat_router)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처에서의 요청을 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드를 허용
    allow_headers=["*"],  # 모든 헤더를 허용
)

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
