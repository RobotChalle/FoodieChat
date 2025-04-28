import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import CalendarView from './CalendarView';
import TableView from './TableView';
import './css/usermealsearch.css';
import './css/main.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import NotoSansKR from '../fonts/NotoSansKR';

export default function UserMealSearch() {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [responseType, setResponseType] = useState('table');
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [mealSummary, setMealSummary] = useState(''); // ✅ 추가
  const [summaryLoading, setSummaryLoading] = useState(false); // ✅ 추가

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const FAST_API_URL = process.env.REACT_APP_FAST_API_URL;

  // ✅ PDF 저장 함수 추가
  const handleDownloadPDF = () => {
    if (filteredMeals.length === 0) {
      alert('저장할 식단 데이터가 없습니다.');
      return;
    }

    const doc = new jsPDF();

    // ✅ 한글 폰트 등록
    doc.addFileToVFS('NotoSansKR-Regular.ttf', NotoSansKR);
    doc.addFont('NotoSansKR-Regular.ttf', 'NotoSansKR', 'normal');
    doc.setFont('NotoSansKR');

    // ✅ 제목
    doc.setFontSize(18);
    doc.text('식단 요약', 14, 22);

    // ✅ 요약 텍스트
    if (mealSummary) {
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(mealSummary, 180);
      doc.text(splitText, 14, 35);
    }

    // ✅ 식단 테이블
    const tableColumn = ["날짜", "식사 유형", "식단 내용", "칼로리"];
    const tableRows = filteredMeals.map(meal => [
      meal.meal_date || '',
      meal.meal_type_nm || '',
      meal.meal_text || '',
      meal.calories !== undefined ? `${meal.calories} kcal` : ''
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: mealSummary ? 55 : 30,
      styles: {
        font: 'NotoSansKR',     // 본문도
        fontSize: 10,
      },
      headStyles: {
        font: 'NotoSansKR',      // ✅ 헤더도!
        fontSize: 11,
        fillColor: [78, 115, 223], // 헤더 배경색 (파란색 계열)
        textColor: 255,            // 헤더 글자색 (흰색)
        halign: 'center',          // 헤더 글자 가운데 정렬
      },
      bodyStyles: {
        valign: 'middle',          // 본문 셀 세로 가운데 정렬
      },
    });

    doc.save('meal_summary.pdf');
  };

  useEffect(() => {
    axios.get(`${BASE_URL}/users/meals`, { withCredentials: true })
      .then(res => setMeals(res.data))
      .catch(err => console.error('식단 조회 실패:', err));
  }, []);

  const handleViewChange = (type) => {
    setResponseType(type);
    setFilteredMeals([]); // ✅ 버튼 누르면 기존 데이터도 같이 초기화
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
  
    const userMessage = { role: 'user', content: query };
    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);
  
    try {
      const res = await axios.post(`${FAST_API_URL}/query`, {
        query,
        meals,
        viewType: responseType, // 👉 현재 선택된 타입을 같이 보내
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
  
      const result = res.data;
      setFilteredMeals(result.filteredMeals);  // ✅ 이때만 세팅
      const aiMessage = {
        role: 'ai',
        content: responseType === 'table'
          ? '📋 테이블 형식으로 보여드릴게요.'
          : '📅 달력 형식으로 보여드릴게요.'
      };
      setChatHistory(prev => [...prev, aiMessage]);

      // ✅ 이제 요약 가져오자
      await fetchMealSummary(result.filteredMeals);
    } catch (error) {
      console.error('❌ 서버 요청 실패', error);
    } finally {
      setQuery('');
      setLoading(false);
    }
  };

  // ✅ 요약 호출
  const fetchMealSummary = async (meals) => {
    try {
      setSummaryLoading(true);
      const res = await axios.post(`${FAST_API_URL}/meal/summary`, meals, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      setMealSummary(res.data.summary || '');
    } catch (error) {
      console.error('❌ 식단 요약 실패', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="usermealsearch-wrapper">
        <div className="usermealsearch-inner">
          <div className="chat-feature-panel">
            <div className="visualizer">
              {/* ✅ PDF 다운로드 버튼 추가 */}
              {filteredMeals.length > 0 && (
                <div className="pdf-download-container">
                  <button className="pdf-download-button" onClick={handleDownloadPDF}>
                    📄 PDF 저장
                  </button>
                </div>
              )}

              {loading ? (
                <div className="loading-message">⏳ 분석 중입니다...</div>
              ) : (
                <>
                  {filteredMeals.length > 0 ? (  // ✅ 데이터가 있을 때만 보여줘야 함
                    responseType === 'table' ? <TableView meals={filteredMeals} /> : <CalendarView meals={filteredMeals} />
                  ) : (
                    <div className="loading-message">❗ 메세지를 입력하고 조회를 진행해주세요.</div> // ✅ 데이터 없으면 안내문구
                  )}
                </>
              )}
            </div>
          </div>

          <div className="chatbot-panel">
            <div className="view-toggle-buttons">
              <button
                className={`view-button ${responseType === 'table' ? 'active' : ''}`}
                onClick={() => handleViewChange('table')}
              >
                📋 테이블 보기
              </button>
              <button
                className={`view-button ${responseType === 'calendar' ? 'active' : ''}`}
                onClick={() => handleViewChange('calendar')}
              >
                📅 달력 보기
              </button>
            </div>

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
