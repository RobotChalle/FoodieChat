import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("AIzaSyAVDD8k-3D3OuyV4QYxkKbhDRlrDe3KuT8"))  # 또는 직접 키 입력 가능

#제미니 2.0 flash 사용
model = genai.GenerativeModel("gemini-2.0-flash")

def get_gemini_response(prompt: str) -> str:
    response = model.generate_content(prompt)
    return response.text.strip()
