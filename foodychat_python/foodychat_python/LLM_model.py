import google.generativeai as genai
from langchain_community.embeddings import OllamaEmbeddings
from utils.rag_text_templates import build_full_rag_text

# Gemini API Key
GOOGLE_API_KEY = 'AIzaSyAVDD8k-3D3OuyV4QYxkKbhDRlrDe3KuT8'

# Gemini Flash 모델 설정
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

def generate_answer_from_gemini(user_id: int, question: str, context: str) -> str:
    """
    사용자의 데이터와 질문을 바탕으로 Gemini API를 호출하여 맞춤형 답변을 생성합니다.
    
    :param user_id: 사용자의 ID
    :param question: 사용자가 입력한 질문
    :param context: RAG 방식으로 검색된 관련 텍스트
    :return: Gemini 모델이 생성한 답변
    """
    try:
        # 시스템 프롬프트 생성: 사용자 정보와 질문을 바탕으로 맞춤형 프롬프트 생성
        system_prompt = (
            f"너는 사용자 맞춤 식단 및 건강 상담 도우미야.\n"
            f"다음은 사용자(user_id={user_id})의 건강 및 음식 기록 정보야:\n\n{context}\n\n"
            f"아래의 질문에 대해 이 정보를 바탕으로 맞춤형으로 응답해줘."
        )

        # 시스템 프롬프트와 사용자 질문을 Gemini에 전달
        response = model.generate_content([
            {"role": "user", "parts": [system_prompt]},  # system role 제거, user로 변경
            {"role": "user", "parts": [question]}  # user role 유지
        ])
        
        # 응답 반환
        return response.text

    except Exception as e:
        print(f"Gemini 연결 실패: {str(e)}")
        return "챗봇 응답 생성에 실패했습니다. 다시 시도해 주세요."

# 예시 실행
if __name__ == "__main__":
    user_id = 12345
    question = "오늘의 저녁은 무엇이 좋을까요?"
    context = "사용자 최근 식단은 고단백, 저지방 식사입니다. 건강 목표는 체중 감량입니다."

    answer = generate_answer_from_gemini(user_id, question, context)
    print("챗봇 답변:", answer)
