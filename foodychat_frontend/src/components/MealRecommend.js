import React, { useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { toast } from 'react-toastify';
import './css/meal-recommend.css';
import './css/main.css';

export default function MealRecommendation() {
    const getToday = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getEndOfMonth = () => {
    const date = new Date();
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        return end.toISOString().split('T')[0];
    };

    const [startDate, setStartDate] = useState(getToday());
    const [endDate, setEndDate] = useState(getEndOfMonth());
    const [mealTypes, setMealTypes] = useState([]);
    const [recommendedMeals, setRecommendedMeals] = useState([]);
    const [loading, setLoading] = useState(false); // ✅ 로딩 상태 추가
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const handleCheckboxChange = (type) => {
        if (type === 'all') {
            const isAllSelected = mealTypes.includes('breakfast') && mealTypes.includes('lunch') && mealTypes.includes('dinner');
            setMealTypes(isAllSelected ? [] : ['breakfast', 'lunch', 'dinner']);
        } else {
            setMealTypes((prev) =>
                prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
            );
        }
    };

    const handleRecommend = async () => {
        try {
          setLoading(true); // ✅ 로딩 시작
            // 'all'은 제거하고 넘김
            const filteredTypes = mealTypes.filter((type) => type !== 'all');
            const payload = new URLSearchParams({
                start: startDate,
                end: endDate,
                types: filteredTypes.join(',')
            });

            const response = await axios.post(`${BASE_URL}/analyze/recommend`, payload, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                withCredentials: true
            });

            if (response.status === 200) {
                toast.success('추천 완료!');
            }
            setRecommendedMeals(response.data.result);
        } catch (error) {
            console.error('추천 실패:', error);
        } finally {
          setLoading(false); // ✅ 로딩 종료
      }
    };


  return (
    <>
    <NavBar />
    <div className="recommend-wrapper">
      <div className="recommend-inner">
        <h2 className="title">📅 맞춤 식단 추천</h2>

        <div className="form-row">
          <div className="form-group-inline">
            <label>기간 선택</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="date-input" />
            <span className="tilde">~</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="date-input" />
          </div>

          <div className="form-group-inline meal-type-group">
            <label>식사 선택</label>
            <label><input type="checkbox" checked={mealTypes.includes('breakfast') && mealTypes.includes('lunch') && mealTypes.includes('dinner')} onChange={() => handleCheckboxChange('all')} /> 전체</label>
            <label><input type="checkbox" checked={mealTypes.includes('breakfast')} onChange={() => handleCheckboxChange('breakfast')} /> 조식</label>
            <label><input type="checkbox" checked={mealTypes.includes('lunch')} onChange={() => handleCheckboxChange('lunch')} /> 중식</label>
            <label><input type="checkbox" checked={mealTypes.includes('dinner')} onChange={() => handleCheckboxChange('dinner')} /> 석식</label>
          </div>

          <button onClick={handleRecommend} className="btn btn-primary" disabled={loading}>
              {loading ? '🍽 추천중...' : '🍱 추천 받기'} {/* ✅ 텍스트 변경 */}
          </button>
        </div>

        {loading && (
            <p style={{ marginTop: '10px', fontWeight: '500', color: '#555' }}>
                추천 결과를 생성 중입니다. 잠시만 기다려주세요...
            </p>
        )}

        <div className="table-scroll-container">
          <table className="result-table">
            <thead>
              <tr>
                <th className="col-narrow">날짜</th>
                <th className="col-narrow">식사구분</th>
                <th className="col-wide">추천메뉴</th>
              </tr>
            </thead>
            <tbody>
              {recommendedMeals.map((meal, index) => (
                <tr key={index}>
                  <td>{meal.date}</td>
                  <td>{meal.type}</td>
                  <td>{meal.menu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}
