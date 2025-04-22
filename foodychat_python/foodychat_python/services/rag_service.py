# services/rag_service.py

from langchain_chroma import Chroma
from langchain_community.embeddings import OllamaEmbeddings
from langchain_core.documents import Document
from utils.rag_text_templates import build_full_rag_text
from utils.rag_builder import build_and_store_rag
from models.schemas import FullUserProfileSchema
from LLM_model import generate_answer_from_gemini

CHROMA_PATH = "chroma_db"
embedding_model = OllamaEmbeddings(model="nomic-embed-text")

def generate_user_rag(user_data: FullUserProfileSchema):
    """
    사용자의 정보를 바탕으로 RAG 텍스트를 생성하고, 이를 Chroma DB에 무조건 갱신합니다.
    """
    user_id = user_data.user_details.user_id
    collection_name = f"user_{user_id}"

    print(f"📄 [RAG] 유저 정보 기반 문서 갱신 시작 (user_id={user_id})")

    # ✅ 1. 기존 RAG 삭제 (컬렉션 제거)
    try:
        existing = Chroma(
            collection_name=collection_name,
            embedding_function=embedding_model,
            persist_directory=CHROMA_PATH
        )
        existing._collection.delete()  # 내부 컬렉션 삭제a
        print(f"🗑️ 기존 RAG 삭제 완료: {collection_name}")
    except Exception as e:
        print(f"⚠️ 기존 RAG 삭제 실패 (무시 가능): {e}")

    # ✅ 2. 텍스트 생성
    rag_text = build_full_rag_text(user_data)
    documents = [Document(page_content=rag_text)]

    # ✅ 3. 새로 저장
    build_and_store_rag(documents, collection_name)

    print(f"✅ [RAG] 새로운 Chroma 저장 완료: {collection_name}")
    
def generate_chat_response(user_id: int, question: str) -> str:
    """
    사용자의 질문에 대해 Chroma에서 RAG 문서를 검색하고, Gemini 모델로 응답을 생성합니다.
    """
    collection_name = f"user_{user_id}"
    print(f"\n🧠 [RAG] user_id={user_id} 질문: {question}")

    # 벡터 DB 로딩
    vectorstore = Chroma(
        collection_name=collection_name,
        embedding_function=embedding_model,
        persist_directory=CHROMA_PATH
    )

    # 벡터 검색
    docs = vectorstore.similarity_search(question, k=3)
    print("📄 [RAG] 검색된 문서:")
    for i, doc in enumerate(docs):
        print(f"  {i+1}. {doc.page_content[:100]}...")  # 너무 길면 100자만

    retrieved_text = "\n".join([doc.page_content for doc in docs])

    if not retrieved_text:
        retrieved_text = "사용자 정보가 충분하지 않습니다. 기본 상담으로 진행합니다."
        print("⚠️ [RAG] 검색된 문서가 없습니다. 기본 context 사용.")

    # Gemini 호출
    return generate_answer_from_gemini(user_id, question, retrieved_text)
