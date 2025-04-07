import os
from openai import OpenAI
from dotenv import load_dotenv

# 환경 변수 로드 (.env 파일에 OPENAI_API_KEY가 있어야 함)
load_dotenv()

# OpenAI 클라이언트 생성
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_llm(prompt: str, model: str = "gpt-3.5-turbo", temperature: float = 0.7):
    """
    OpenAI LLM에 메시지를 보내고 응답을 받는 함수

    Args:
        prompt (str): 사용자 입력 프롬프트
        model (str): 사용할 OpenAI 모델
        temperature (float): 창의성 조절 매개변수 (0.0 ~ 1.0)

    Returns:
        str: LLM이 생성한 응답 텍스트
    """
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error from OpenAI API: {str(e)}"