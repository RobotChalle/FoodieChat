from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from LLM_model import ask_llm
from LLM_prompt import format_prompt, RAG_PROMPT, PRIVATE_PROMPT, HEALTH_PROMPT, PROFILE_PROMPT
from services.reg_service import query_gemini_rag

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str

@router.post("/message")
async def get_chat_response(request: ChatRequest, mode: str = Query("default", enum=["default", "health", "private", "profile"])):
    try:
        # 구분값에 따라 프롬프트 선택
        if mode == "health":
            prompt = format_prompt(HEALTH_PROMPT, question=request.message)
        elif mode == "private":
            prompt = format_prompt(PRIVATE_PROMPT, question=request.message)
        elif mode == "profile":
            prompt = format_prompt(PROFILE_PROMPT, question=request.message)
        else:
            prompt = format_prompt(RAG_PROMPT, question=request.message)

        response = ask_llm(prompt=prompt)
        return {"mode": mode, "prompt": prompt, "response": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ChatInput(BaseModel):
    user_id: int
    question: str

@router.post("/chat")
def chat_with_gemini(input: ChatInput):
    answer = query_gemini_rag(input.user_id, input.question)
    return {"answer": answer}