import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import CalendarView from './CalendarView';
import TableView from './TableView';
import './css/usermealsearch.css';
import './css/main.css';

export default function UserMealSearch() {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [responseType, setResponseType] = useState('table');
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const FAST_API_URL = process.env.REACT_APP_FAST_API_URL;

  console.log("👉 BASE_URL:", process.env.REACT_APP_BASE_URL);
  console.log("👉 FAST_API_URL:", process.env.REACT_APP_FAST_API_URL);
  useEffect(() => {
    axios.get(`${BASE_URL}/users/meals`, { withCredentials: true })
      .then(res => setMeals(res.data))
      .catch(err => console.error('식단 조회 실패:', err));
  }, []);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setChatHistory(prev => [...prev, userMessage]);

    setLoading(true);
    try {
      console.log('📤 쿼리 전송:', query);
      console.log('📤 meals 전송:', meals);
      const res = await axios.post(`${FAST_API_URL}/query`, {
        query,
        meals
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      const result = res.data;
      console.log('📥 응답 결과:', result);
      setResponseType(result.type);
      setFilteredMeals(result.filteredMeals);

      const aiMessage = {
        role: 'ai',
        content: result.type === 'table'
          ? '📋 식단을 테이블 형식으로 보여드릴게요.'
          : '📅 식단을 달력 형식으로 보여드릴게요.'
      };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'ai',
        content: '❌ 오류가 발생했습니다. 다시 시도해주세요.'
      };
      setChatHistory(prev => [...prev, errorMessage]);
      console.error('LLM 쿼리 실패:', error);

      if (error.response?.status === 429) {
        alert("OpenAI 사용량이 초과되었습니다. 잠시 후 다시 시도해 주세요.");
      } else {
        alert("요청 중 오류가 발생했습니다.");
      }
    } finally {
      setQuery('');
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="usermealsearch-wrapper">
        <div className="usermealsearch-inner">
          <div className="chat-feature-panel">
            <div className="visualizer">
              {loading ? (
                <div className="loading-message">⏳ 분석 중입니다...</div>
              ) : (
                <>
                  {responseType === 'table' && <TableView meals={filteredMeals} />}
                  {responseType === 'calendar' && <CalendarView meals={filteredMeals} />}
                </>
              )}
            </div>
          </div>

          <div className="chatbot-panel">
            <div className="chat-title-bar">
              <span className="chat-icon">💬</span>
              <h3 className="chat-title">챗봇</h3>
            </div>

            <div className="chat-history">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.role}`}>
                  <div className="chat-bubble">
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="chatbot-input-area">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="예: 3월 식단을 달력으로 보여줘"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? '전송 중...' : '전송'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
