import sys
import io
import json
import requests
from bs4 import BeautifulSoup

# 콘솔 인코딩 문제 방지
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def crawl_naver(food_name, location):
    keyword = f"{location} {food_name} 맛집"
    url = f"https://search.naver.com/search.naver?query={keyword}"
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    items = []
    # ✅ 이미지 기반 alt + 상위 a태그의 href 추출
    for img_tag in soup.select("a.place_thumb img"):
        name = img_tag.get("alt")
        link_tag = img_tag.find_parent("a")
        link = link_tag.get("href") if link_tag else None

        if name and link:
            items.append({
                "name": name.strip(),
                "address": link.strip()
            })

    # ✅ 이름 기준 중복 제거
    unique_items = []
    seen_names = set()
    for item in items:
        if item['name'] not in seen_names:
            seen_names.add(item['name'])
            unique_items.append(item)

    return unique_items[:5]  # 최대 5개만 반환

if __name__ == "__main__":
    food_name = sys.argv[1]
    location = sys.argv[2]
    data = crawl_naver(food_name, location)
    print(json.dumps(data, ensure_ascii=False))
