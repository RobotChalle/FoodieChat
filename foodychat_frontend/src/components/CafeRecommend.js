import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { toast } from 'react-toastify';
import './css/meal-recommend.css';
import './css/main.css';
import { useParams } from 'react-router-dom';
import KakaoMap from './KakaoMap';

export default function MealRecommendation() {
  const { foodName: paramFoodName } = useParams();
  const [foodName, setFoodName] = useState(paramFoodName || '');
  const [foodNameTranslations, setFoodNameTranslations] = useState({});
  const [location, setLocation] = useState('');
  const [recommendedStore, setRecommendedStore] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ 번역 정보 가져오기
  useEffect(() => {
    axios.get('http://localhost:8080/analyze/foods/translations')
      .then(res => {
        setFoodNameTranslations(res.data);

        if (paramFoodName && res.data[paramFoodName.toLowerCase()]) {
          setFoodName(paramFoodName.toLowerCase());
        }
      })
      .catch(err => {
        console.error('음식 번역 데이터 불러오기 실패:', err);
      });
  }, []);

  const translatedFood = foodNameTranslations[foodName?.toLowerCase()];

  const handleRecommend = async () => {
    if (!foodName.trim()) {
      toast.error('음식을 선택해주세요!');
      return;
    }

    if (!location.trim()) {
      toast.error('위치를 입력해주세요!(예: 수원역)');
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

      const storeList = response.data.slice(0, 5);
      setRecommendedStore(storeList);
      console.error('StoreList:',storeList);

      // 2. FastAPI로 Gemini 요약 요청
      const aiResponse = await axios.post('http://localhost:8000/cafe-recommend', {
        food: foodName,
        location: location,
        stores: storeList
      });

      setSummary(aiResponse.data.summary);
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
        <h2 className="recommend-title">📍 식당 추천</h2>

        <div className="recommend-form-card">
          <div className="input-group-row">
            <div className="input-item">
              <label>음식 선택</label>
              <select value={foodName} onChange={(e) => setFoodName(e.target.value)}>
                <option value="">-- 음식 선택 --</option>
                {Object.keys(foodNameTranslations).map((key) => (
                  <option key={key} value={key}>
                    {foodNameTranslations[key]} ({key})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-item">
              <label>위치</label>
              <input
                placeholder="예: 수원역"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRecommend();
                  }
                }}
              />
            </div>

            <div className="input-item button-wrap">
              <button onClick={handleRecommend} disabled={loading}>
                {loading ? '추천중...' : '추천 받기'}
              </button>
            </div>
          </div>

          {translatedFood && (
            <div className="translated-food">
              <strong>선택한 음식:</strong> {translatedFood}
            </div>
          )}

          {/* ✅ AI 요약 결과 */}
          {summary && (
            <div className="ai-summary-box">
              <h3>🤖 AI 요약 추천</h3>
              <p>{summary}</p>
            </div>
          )}

          {/* ✅ 식당 리스트 */}
          {recommendedStore.length > 0 && (
            <>
              <KakaoMap stores={recommendedStore} />   {/* ✅ 지도 삽입 */}
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
                      value={store.url}
                      onClick={() => window.open(store.url, '_blank')}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && recommendedStore.length === 0 && (
            <p className="no-result">추천된 식당이 없습니다. 주소를 입력해 주세요.</p>
          )}
        </div>
      </div>
    </>
  );
}