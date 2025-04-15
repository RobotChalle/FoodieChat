from langchain.embeddings import OllamaEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from utils.rag_text_templates import generate_rag_text

import os
from typing import List, Dict, Any
import logging

# 로그 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Chroma 저장 디렉토리
CHROMA_DIR = "app/vectorstores/chroma_user_data"

# 1. 사용자 RAG 텍스트 → LangChain Document 생성
def create_user_rag(user: Dict[str, Any], bmis: List[Any], foods: List[Any]) -> Document:
    rag_text = generate_rag_text(user, bmis, foods)
    return Document(page_content=rag_text, metadata={"user_id": user.user_id})

# 2. 텍스트 분할기 정의
def split_document(document: Document) -> List[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ".", " ", ""]
    )
    return splitter.split_documents([document])

# 3. 임베딩 생성기
def get_embeddings() -> OllamaEmbeddings:
    return OllamaEmbeddings(model="mistral")  # 변경 가능: "llama2", "nomic-embed-text" 등

# 4. Chroma 벡터스토어에 저장
def save_to_chroma(docs: List[Document], user_id: int) -> str:
    try:
        os.makedirs(CHROMA_DIR, exist_ok=True)

        vectorstore = Chroma(
            collection_name=f"user_{user_id}",
            embedding_function=get_embeddings(),
            persist_directory=CHROMA_DIR,
        )
        vectorstore.add_documents(docs)
        vectorstore.persist()

        logger.info(f"User {user_id} RAG 저장 완료")
        return f"✅ User {user_id}의 RAG 문서 저장 완료!"
    except Exception as e:
        logger.error(f"❌ 저장 실패: {e}")
        return f"❌ User {user_id} RAG 저장 실패"

# 5. 전체 파이프라인 실행 함수
def process_user_rag(user: Dict[str, Any], bmis: List[Any], foods: List[Any]) -> str:
    logger.info(f"🔁 User {user.user_id} RAG 생성 시작")
    document = create_user_rag(user, bmis, foods)
    split_docs = split_document(document)
    result = save_to_chroma(split_docs, user.user_id)
    return result
