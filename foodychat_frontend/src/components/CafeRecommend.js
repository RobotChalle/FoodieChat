import React, { useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { toast } from 'react-toastify';
import './css/meal-recommend.css';
import './css/main.css';
import { useParams } from 'react-router-dom';

export default function MealRecommendation() {
    const foodNameTranslations = {
        "apple_pie": "애플파이",
        "baby_back_ribs": "바비큐 폭립",
        "baklava": "바클라바",
        "beef_carpaccio": "소고기 카르파초",
        "beef_tartare": "비프 타르타르",
        "beet_salad": "비트 샐러드",
        "beignets": "베녜 (도넛과 비슷한 프랑스 과자)",
        "bibimbap": "비빔밥",
        "bread_pudding": "브레드 푸딩",
        "breakfast_burrito": "아침 부리또",
        "bruschetta": "브루스케타",
        "caesar_salad": "시저 샐러드",
        "cannoli": "카놀리",
        "caprese_salad": "카프레제 샐러드",
        "carrot_cake": "당근 케이크",
        "ceviche": "세비체",
        "cheesecake": "치즈케이크",
        "cheese_plate": "치즈 플레이트",
        "chicken_curry": "치킨 커리",
        "chicken_quesadilla": "치킨 케사디야",
        "chicken_wings": "치킨 윙",
        "chocolate_cake": "초콜릿 케이크",
        "chocolate_mousse": "초콜릿 무스",
        "churros": "츄러스",
        "clam_chowder": "클램 차우더",
        "club_sandwich": "클럽 샌드위치",
        "crab_cakes": "크랩 케이크",
        "creme_brulee": "크렘 브륄레",
        "croque_madame": "크로크 마담",
        "cup_cakes": "컵케이크",
        "deviled_eggs": "데빌드 에그",
        "donuts": "도넛",
        "dumplings": "만두",
        "edamame": "에다마메 (풋콩)",
        "eggs_benedict": "에그 베네딕트",
        "escargots": "에스카르고 (달팽이 요리)",
        "falafel": "팔라펠",
        "filet_mignon": "필레 미뇽",
        "fish_and_chips": "피쉬 앤 칩스",
        "foie_gras": "푸아그라",
        "french_fries": "프렌치프라이",
        "french_onion_soup": "프렌치 어니언 수프",
        "french_toast": "프렌치 토스트",
        "fried_calamari": "오징어 튀김",
        "fried_rice": "볶음밥",
        "frozen_yogurt": "요거트 아이스크림",
        "garlic_bread": "마늘빵",
        "gnocchi": "뇨끼",
        "greek_salad": "그리스 샐러드",
        "grilled_cheese_sandwich": "그릴 치즈 샌드위치",
        "grilled_salmon": "연어 구이",
        "guacamole": "과카몰리",
        "gyoza": "교자",
        "hamburger": "햄버거",
        "hot_and_sour_soup": "매운 신 수프",
        "hot_dog": "핫도그",
        "huevos_rancheros": "웨보스 란체로스 (멕시코식 달걀요리)",
        "hummus": "후무스",
        "ice_cream": "아이스크림",
        "lasagna": "라자냐",
        "lobster_bisque": "랍스터 비스크",
        "lobster_roll_sandwich": "랍스터 롤 샌드위치",
        "macaroni_and_cheese": "맥앤치즈",
        "macarons": "마카롱",
        "miso_soup": "미소 된장국",
        "mussels": "홍합 요리",
        "nachos": "나초",
        "omelette": "오믈렛",
        "onion_rings": "어니언링",
        "oysters": "굴 요리",
        "pad_thai": "팟타이",
        "paella": "파에야",
        "pancakes": "팬케이크",
        "panna_cotta": "판나코타",
        "peking_duck": "북경오리",
        "pho": "쌀국수",
        "pizza": "피자",
        "pork_chop": "포크찹 (돼지갈비살)",
        "poutine": "푸틴 (캐나다 감자 요리)",
        "prime_rib": "프라임 립",
        "pulled_pork_sandwich": "풀드 포크 샌드위치",
        "ramen": "라면",
        "ravioli": "라비올리",
        "red_velvet_cake": "레드벨벳 케이크",
        "risotto": "리조또",
        "samosa": "사모사",
        "sashimi": "사시미",
        "scallops": "가리비 요리",
        "seaweed_salad": "해초 샐러드",
        "shrimp_and_grits": "새우와 그리츠",
        "spaghetti_bolognese": "스파게티 볼로네제",
        "spaghetti_carbonara": "스파게티 카르보나라",
        "spring_rolls": "춘권 (스프링롤)",
        "steak": "스테이크",
        "strawberry_shortcake": "딸기 쇼트케이크",
        "sushi": "스시",
        "tacos": "타코",
        "takoyaki": "타코야끼",
        "tiramisu": "티라미수",
        "tuna_tartare": "참치 타르타르",
        "waffles": "와플"
      };

      const { foodName } = useParams();
      const translatedFood = foodNameTranslations[foodName.toLowerCase()];
  const [location, setLocation] = useState('');
  const [recommendedStore, setRecommendedStore] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!location.trim()) {
      toast.error('주소를 입력해주세요!');
      return;
    }

    try {
      setLoading(true);

      const payload = new URLSearchParams({
        foodName: foodName,
        location: location,
      });

      const response = await axios.post('http://localhost:8080/analyze/store', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('추천 완료!');
      }

      setRecommendedStore(response.data.slice(0, 5)); // ✅ 최대 5개까지 표시
    } catch (error) {
      console.error('추천 실패:', error);
      toast.error('추천 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="recommend-form-container">
        <h2 className="recommend-title">📍  {translatedFood ? translatedFood : foodName} 식당 추천</h2>

        <div className="recommend-form-card">
          <div className="input-group">
            <label htmlFor="location">주소</label>
                <input
                    placeholder="주소를 입력하세요!"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                        e.preventDefault(); // form이 없더라도 방지
                        handleRecommend();
                        }
                    }}
                    />
            <button onClick={handleRecommend} disabled={loading}>
              {loading ? '추천중...' : '추천 받기'}
            </button>
          </div>

          {recommendedStore.length > 0 && (
            <div className="result-section">
              <h3 className="result-title">🔖 추천 식당 목록</h3>
              {recommendedStore.map((store, index) => (
                <div key={index} className="result-item">
                  <label>식당명</label>
                  <input type="text" readOnly value={store.name} />
                  <label>링크</label>
                  <input
                    type="text"
                    readOnly
                    value={store.address}
                    onClick={() => window.open(store.address, '_blank')}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          )}

          {!loading && recommendedStore.length === 0 && (
            <p className="no-result">추천된 식당이 없습니다. 주소를 입력해 주세요.</p>
          )}
        </div>
      </div>
    </>
  );
}