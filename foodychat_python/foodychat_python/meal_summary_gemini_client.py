# foodychat_python/services/gemini_client.py
import httpx
import os

GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDPr7KPl7PZT9pnW-_fzA23ui6pOHnehwE"

async def call_gemini(prompt: str) -> str:
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(GEMINI_API_URL, headers=headers, json=payload)
        
    print("✅ Gemini API 응답 원문:", await response.aread())

    # 응답 상태 확인
    if response.status_code != 200:
        raise Exception(f"❌ Gemini API 호출 실패: HTTP {response.status_code}")

    try:
        data = response.json()
    except Exception as e:
        raise Exception(f"❌ Gemini 응답을 JSON으로 파싱 실패: {e}")

    candidates = data.get("candidates")
    if not candidates:
        raise Exception(f"❌ Gemini 응답에 candidates가 없습니다: {data}")

    try:
        text = candidates[0]["content"]["parts"][0]["text"]
        if not text or not text.strip():
            raise Exception("❌ Gemini 텍스트가 비어있습니다.")
        return text
    except (KeyError, IndexError) as e:
        raise Exception(f"❌ Gemini 응답 포맷 오류: {e}, 데이터: {data}")