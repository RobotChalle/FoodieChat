from fastapi import APIRouter
from pydantic import BaseModel
from services.rag_service import generate_chat_response, generate_user_rag
from services.user_data_loader import get_user_data  # 유저 데이터 로더
from models.schemas import FullUserProfileSchema  # Pydantic 모델 import

router = APIRouter()

# 요청 모델
class ChatRequest(BaseModel):
    user_id: int
    question: str

# 응답 모델
class ChatResponse(BaseModel):
    answer: str

# POST 엔드포인트 - 질문 처리
@router.post("/chat/chat", response_model=ChatResponse)
async def chat(chat_req: ChatRequest):
    """
    사용자 질문을 받아 RAG + Gemini 기반 응답 반환
    """
    # ✅ 1. 유저 정보 불러오기
    user_data_dict = await get_user_data(chat_req.user_id)  # dict 반환

    # ✅ 2. dict → Pydantic 모델 변환
    user_data = FullUserProfileSchema(**user_data_dict)  # FullUserProfileSchema로 변환

    # ✅ 3. RAG 벡터화 생성 (최초 1회 또는 매번 갱신)
    generate_user_rag(user_data)

    # ✅ 4. 질문 처리
    answer = generate_chat_response(chat_req.user_id, chat_req.question)

    return ChatResponse(answer=answer)

# 테스트용 - RAG 텍스트 확인
@router.get("/chat/user-rag-text/{user_id}")
async def get_rag_text(user_id: int):
    user_data_dict = await get_user_data(user_id)  # dict 반환
    user_data = FullUserProfileSchema(**user_data_dict)  # dict → Pydantic 모델 변환
    rag_text = await generate_user_rag(user_data)  # RAG 텍스트 생성
    return {"rag_text": rag_text}
