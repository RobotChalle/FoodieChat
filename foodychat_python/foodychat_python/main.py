import uvicorn
from fastapi import FastAPI
from router import chat_router
from sqlalchemy.orm import Session
from database import get_db  # DB 세션 주입
from services.rag_service import build_rag_document
from fastapi.middleware.cors import CORSMiddleware
from UserMealLLM_models import MealQueryRequest
from UserMealLLM_service_gemini import build_prompt, query_openai
import json
import re
from fastapi.responses import JSONResponse


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
    
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

#RAG파일 생성
@app.get("/rag/{user_id}")
def get_rag_document(user_id: int, db: Session = Depends(get_db)):
    rag_text = build_rag_document(db, user_id)
    if rag_text is None:
        return {"error": "User not found"}

    # Optional: 저장도 가능
    with open(f"rag_user_{user_id}.txt", "w", encoding="utf-8") as f:
        f.write(rag_text)

    return {"rag": rag_text}