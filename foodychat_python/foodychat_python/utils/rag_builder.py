# utils/rag_builder.py

from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_community.embeddings import OllamaEmbeddings
from typing import List

CHROMA_PATH = "chroma_db"
embedding_model = OllamaEmbeddings(model="nomic-embed-text")

def build_and_store_rag(documents: List[Document], collection_name: str):
    """
    생성된 문서 리스트를 Chroma DB에 저장합니다.
    """
    print(f"📦 [RAG Builder] 문서 저장 시작: {collection_name}")

    # Chroma DB에서 컬렉션 로드 또는 생성
    vectorstore = Chroma(
        collection_name=collection_name,
        embedding_function=embedding_model,
        persist_directory=CHROMA_PATH
    )

    # 문서 벡터화 및 저장
    vectorstore.add_documents(documents)

    print(f"✅ [RAG Builder] 문서 저장 완료: {collection_name}")
