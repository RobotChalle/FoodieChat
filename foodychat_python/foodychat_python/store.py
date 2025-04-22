import sys
import io
import json
import requests
from bs4 import BeautifulSoup
import re

# 콘솔 인코딩 문제 방지 (Windows 콘솔에서 한글 깨짐 방지용)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

KAKAO_REST_API_KEY = '0146dca41d8270e805a5134078869c29'

def get_real_address_by_kakao(name, location):
    try:
        keyword = f"{name} {location}"  # 음식점 이름 먼저 → 검색 정확도 ↑
        url = "https://dapi.kakao.com/v2/local/search/keyword.json"
        headers = {
            "Authorization": f"KakaoAK {KAKAO_REST_API_KEY}"
        }
        params = {
            "query": keyword,
            "size": 1
        }

        res = requests.get(url, headers=headers, params=params)
        data = res.json()

        if data.get("documents"):
            doc = data["documents"][0]
            return {
                "road_address": doc.get("road_address_name"),
                "address": doc.get("address_name"),
                "x": doc.get("x"),
                "y": doc.get("y")
            }
    except Exception as e:
        print("Kakao 주소 검색 실패:", e)

    return None

def crawl_naver(food_name, location):
    keyword = f"{location} {food_name} 맛집"
    url = f"https://search.naver.com/search.naver?query={keyword}"
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    items = []

    # ✅ 복수 선택자 활용 (place_thumb가 없을 경우 대비)
    place_blocks = soup.select("a.place_thumb img")
    if not place_blocks:
        # 백업용: 다른 구조 (네이버가 종종 바꿉니다)
        place_blocks = soup.select("li.place_item div img")

    for img_tag in place_blocks:
        name = img_tag.get("alt")
        link_tag = img_tag.find_parent("a")
        link = link_tag.get("href") if link_tag else None

        # 기본값 설정
        rating = 0.0
        review = "네이버 평점 기반 추천입니다."
        real_address = ""
        
        try:
            # 주소 텍스트 추출
            # 가장 가까운 부모 li 안에서 주소 candidate 찾기
            parent_li = img_tag.find_parent("li")
            if parent_li:
                # 예: <span class="place_bluelink"> or <span class="addr"> 등
                addr_tag = parent_li.select_one("span[class*=addr]") or parent_li.select_one("span[class*=place_bluelink]")
                if addr_tag:
                    real_address = addr_tag.get_text(strip=True)
        except Exception as e:
            print("주소 추출 실패:", e)
            
        # [선택] 주변에서 평점 찾기 (안정적)
        try:
            parent = img_tag.find_parent("div", class_="place_section_content") or img_tag.parent
            rating_tag = parent.select_one("span[aria-label*='별점']") or parent.select_one(".rating")
            if rating_tag:
                rating_text = rating_tag.get_text(strip=True)
                rating = float(rating_text.split()[0].replace('점', ''))
        except Exception as e:
            pass  # 평점이 없으면 기본 0.0 유지

        if name and link:
            kakao_addr = get_real_address_by_kakao(name, location)
            
            items.append({
                "name": name.strip(),
                "real_address": kakao_addr.get("road_address") if kakao_addr else location,
                "url": link.strip(),
                "rating": rating,
                "review": review
            })

    # 중복 제거 (식당 이름 기준)
    unique_items = []
    seen_names = set()
    for item in items:
        if item['name'] not in seen_names:
            seen_names.add(item['name'])
            unique_items.append(item)

    return unique_items[:5]  # 최대 5개만 반환

def crawl_siksin(food, location):
    keyword = f"{location} {food}"
    url = f"https://www.siksinhot.com/search?keywords={keyword}"
    headers = {"User-Agent": "Mozilla/5.0"}

    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")

    items = []
    for li in soup.select("ul.local_list > li")[:5]:
        try:
            name = li.select_one("span.store").text.strip()
            real_address = li.select_one("span.ctg").text.strip()
            rating_tag = li.select_one("em.score")
            rating = float(rating_tag.text.strip()) if rating_tag else 0.0
            url_link = "https://www.siksinhot.com" + li.select_one("a").get("href")

            items.append({
                "name": name,
                "real_address": real_address,
                "url": url_link,
                "rating": rating,
                "review": "식신 기반 추천입니다."
            })
        except Exception as e:
            print("식신 항목 오류:", e)
            continue

    return items

def crawl_diningcode(food, location):
    keyword = f"{location} {food}"
    url = f"https://www.diningcode.com/list.php?query={keyword}"
    headers = {"User-Agent": "Mozilla/5.0"}

    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")

    items = []
    for li in soup.select("ul.dc-restaurant-list li")[:5]:
        try:
            name = li.select_one("a b").text.strip()
            url_link = "https://www.diningcode.com" + li.select_one("a").get("href")
            info = li.select_one("span.dc-sub").text.strip()

            # 주소 일부 포함될 수 있음
            items.append({
                "name": name,
                "real_address": info,
                "url": url_link,
                "rating": 0.0,
                "review": f"다이닝코드: {info}"
            })
        except Exception as e:
            print("다이닝코드 항목 오류:", e)
            continue

    return items


# ✅ 통합 크롤링 함수
def crawl_all_sources(food_name, location):
    all_items = []

    try:
        all_items += crawl_naver(food_name, location)
    except Exception as e:
        print("네이버 크롤링 실패:", e)

    try:
        all_items += crawl_siksin(food_name, location)
    except Exception as e:
        print("식신 크롤링 실패:", e)

    try:
        all_items += crawl_diningcode(food_name, location)
    except Exception as e:
        print("다이닝코드 크롤링 실패:", e)

    # ✅ 중복 제거 (이름 기준)
    unique_items = []
    seen_names = set()
    for item in all_items:
        if item['name'] not in seen_names:
            seen_names.add(item['name'])
            unique_items.append(item)

    return unique_items[:5]

# ✅ CLI 실행
if __name__ == "__main__":
    try:
        food_name = sys.argv[1]
        location = sys.argv[2]
        data = crawl_all_sources(food_name, location)
        print(json.dumps(data, ensure_ascii=False, indent=2))
    except IndexError:
        print("사용법: python crawl_all_sources.py [음식명] [위치]")
