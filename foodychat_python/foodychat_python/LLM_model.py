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
            f"너는 친절하고 똑똑한 AI 건강 상담가야.\n"
            f"📋 사용자 정보 (user_id={user_id}):\n{context}\n"
            f"🙋 사용자 질문:\n{question}\n"
            f"🧠 아래 기준을 꼭 지켜서 응답해줘:\n"
            f"1. 사용자 질문이 가볍든 진지하든, 항상 자연스럽고 인간적인 말투로 시작해.\n"
            f"2. 건강, 운동, 식단, 생활 습관 등 어떤 질문이든 **유익한 조언을 간단하고 핵심 있게 포함**해야 해.\n"
            f"3. 한 응답은 **3~5문단, 각 문단은 2~4줄**로 구성하고 너무 길게 말하지 마.\n"
            f"4. 각 문단은 소제목과 함께 이모지를 붙여줘. (예: 💡 식단 팁)\n"
            f"5. 각 블록은 `---` 선으로 구분해서 시각적으로 보기 좋게 만들어.\n"
            f"6. 질문자가 단순한 인사나 일상 대화를 해도 친근하게 받아주고, 상황에 맞게 간단한 팁을 줘.\n"
            f"7. 전문 용어는 쉽게 풀어서 설명하고, 사용자 건강 목표에 맞게 말해줘.\n"
            f"8. **불필요한 설명은 생략하고 핵심만 요약해서 말해줘.**\n"
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
