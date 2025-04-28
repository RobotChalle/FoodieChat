# foodychat_python/services/meal_summary_service.py
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from meal_summary_llm_service import get_meal_summary_from_llm

async def generate_meal_summary_pdf(meals):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, "식단 요약 (Meal Summary)")
    p.setFont("Helvetica", 10)
    p.drawString(50, height - 70, f"생성일: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # 📌 총 식사 횟수, 총 칼로리 계산
    total_meals = len(meals)
    total_calories = sum(meal.calories or 0 for meal in meals)

    # 📌 LLM 요약
    meal_summary_text = await get_meal_summary_from_llm(meals)

    # 🔥 요약 섹션
    y = height - 100
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y, "✅ 식단 요약 정보")
    p.setFont("Helvetica", 10)
    p.drawString(60, y - 20, f"총 식사 횟수: {total_meals}회")
    p.drawString(60, y - 40, f"총 섭취 칼로리: {total_calories:.2f} kcal")

    # 🔥 LLM 분석
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y - 80, "💬 이달의 식단 분석")
    p.setFont("Helvetica", 10)
    p.drawString(60, y - 100, meal_summary_text[:80])
    p.drawString(60, y - 120, meal_summary_text[80:160] if len(meal_summary_text) > 80 else "")

    # 🔥 표
    y = y - 160
    p.setFont("Helvetica-Bold", 10)
    p.drawString(50, y, "날짜")
    p.drawString(150, y, "식사 유형")
    p.drawString(250, y, "식단 내용")
    p.drawString(450, y, "칼로리")

    p.setFont("Helvetica", 10)
    for meal in meals:
        y -= 20
        if y < 50:
            p.showPage()
            y = height - 50
        p.drawString(50, y, meal.meal_date)
        p.drawString(150, y, meal.meal_type_nm)
        p.drawString(250, y, (meal.meal_text[:25] + '...') if len(meal.meal_text) > 25 else meal.meal_text)
        p.drawString(450, y, f"{meal.calories} kcal" if meal.calories is not None else "-")

    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer
