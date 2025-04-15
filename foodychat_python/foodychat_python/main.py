import uvicorn
from fastapi import FastAPI
from router import chat_router
from sqlalchemy.orm import Session
from database import get_db  # DB 세션 주입
from services.rag_service import build_rag_document

app = FastAPI(title="Chatbot API", description="Ollama Gemma2 기반 챗봇 서비스")

app.include_router(chat_router.router)

@app.get("/")
async def root():
    return {"message": "Chatbot API Running"}

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