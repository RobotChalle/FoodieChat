import uvicorn
from fastapi import FastAPI
from router import chat_router

app = FastAPI(title="Chatbot API", description="Ollama Gemma2 기반 챗봇 서비스")

app.include_router(chat_router.router)

@app.get("/")
async def root():
    return {"message": "Chatbot API Running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)