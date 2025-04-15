from langchain.vectorstores import Chroma
from langchain.embeddings import OllamaEmbeddings
from google.generativeai import GenerativeModel
from langchain.schema import HumanMessage

def query_gemini_rag(user_id: int, question: str, persist_directory: str = "./chroma_db"):
    embedding = OllamaEmbeddings(model="nomic-embed-text")
    db = Chroma(persist_directory=persist_directory, embedding_function=embedding)
    
    docs = db.similarity_search(question, k=3)  # 사용자 정보 관련 top 3 유사 문서
    context = "\n\n".join([doc.page_content for doc in docs])

    prompt = f"""[사용자 정보 기반 응답 생성]
다음은 해당 사용자의 건강/식습관/목표 정보입니다:

{context}

사용자 질문: {question}

위 정보를 참고하여 사용자에게 맞춤형으로 응답해 주세요."""

    model = GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text
