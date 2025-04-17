import httpx  # httpx 모듈 import
from datetime import datetime

async def get_user_data(user_id: int) -> dict:
    """
    FastAPI에서 Spring Boot API로 HTTP 요청을 보내 사용자 상세 정보, 최신 BMI, 음식 기록을 가져온다.
    가져온 데이터를 바탕으로 RAG 생성을 위한 Dict 형태로 반환한다.
    """
    base_url = "http://localhost:8080"  # Spring Boot 서버 주소

    async with httpx.AsyncClient() as client:
        try:
            # 사용자 상세 정보
            user_details_res = await client.get(f"{base_url}/users/{user_id}/details")
            user_details_res.raise_for_status()
            user_details = user_details_res.json()
            print("[DEBUG] user_details:", user_details)  # 응답 JSON 구조 확인

            # BMI 리스트 정보 가져오기
            bmi_res = await client.get(f"{base_url}/users/{user_id}/bmi")
            bmi_res.raise_for_status()
            bmi_list = bmi_res.json()
            print("[DEBUG] bmi_list:", bmi_list)  # 응답 JSON 구조 확인

            # 최신 BMI 정보 가져오기 (정렬 후 가장 최신 데이터)
            latest_bmi = None
            if bmi_list:
                # `reg_date`가 존재하는 데이터 기준으로 정렬하여 최신 데이터를 가져옴
                bmi_list_sorted = sorted(bmi_list, key=lambda x: x['regDate'], reverse=True)
                latest_bmi = bmi_list_sorted[0]
                # `latest_bmi`에 필요한 필드 확인 및 값 채우기
                latest_bmi['bmi_score'] = latest_bmi.get('bmi_score', 0.0)  # 기본값 0.0 설정
                latest_bmi['reg_date'] = latest_bmi.get('reg_date', datetime.now())  # 기본값 현재 시간 설정

            # 최근 음식 기록 (최대 5개)
            meals_res = await client.get(f"{base_url}/users/{user_id}/meals")
            meals_res.raise_for_status()
            meals = meals_res.json()
            print("[DEBUG] meals:", meals)  # 응답 JSON 구조 확인

            # 각 음식 항목에 필요한 필드 확인 및 기본값 설정
            for meal in meals:
                meal['food_name'] = meal.get('food_name', 'Unknown Food')
                meal['calories'] = meal.get('calories', 0)  # 기본값 0 설정
                meal['created_at'] = meal.get('created_at', datetime.now())  # 기본값 현재 시간 설정

            avg_daily_calories = None
            if meals:
                calories = [m['calories'] for m in meals if 'calories' in m]
                # calories 리스트가 비어있지 않으면 평균 칼로리 계산
                if calories:
                    avg_daily_calories = round(sum(calories) / len(calories), 1)
                else:
                    avg_daily_calories = 0  # calories가 비어 있을 경우 기본값 0 설정

            # 최종 데이터 구조
            user_data = {
                "user_details": user_details,  # 사용자 상세 정보
                "latest_bmi": latest_bmi,  # 최신 BMI 정보
                "meals": meals[:1] if meals else [],  # 최대 5개의 음식 기록
                "avg_daily_calories": avg_daily_calories  # 평균 칼로리
            }

            # FullUserProfileSchema에 맞게 데이터를 반환
            return {
                "user_details": user_data['user_details'], 
                "latest_bmi": user_data['latest_bmi'],
                "meals": user_data['meals']
            }

        except httpx.HTTPError as e:
            print(f"[ERROR] Spring API 요청 실패: {e}")
            return {}
