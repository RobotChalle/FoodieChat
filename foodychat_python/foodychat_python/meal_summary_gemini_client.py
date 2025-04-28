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
        response = await client.post(f"{GEMINI_API_URL}", headers=headers, json=payload)
        response.raise_for_status()

    candidates = response.json().get("candidates", [])
    if candidates:
        return candidates[0]["content"]["parts"][0]["text"]
    else:
        return "❌ 요약 실패"
