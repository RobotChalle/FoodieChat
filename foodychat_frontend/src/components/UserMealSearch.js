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
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import html2canvas from 'html2canvas';

export default function UserMealSearch() {
  const [userName, setUserName] = useState('');         // 이름
  const [searchPeriod, setSearchPeriod] = useState('');  // 기간
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [responseType, setResponseType] = useState('table');
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [mealSummary, setMealSummary] = useState(''); // ✅ 추가
  const [summaryLoading, setSummaryLoading] = useState(false); // ✅ 추가
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalFat, setTotalFat] = useState(0);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const FAST_API_URL = process.env.REACT_APP_FAST_API_URL;

  useEffect(() => {
    axios.post(`${BASE_URL}/users/myPage`, {}, { withCredentials: true })
      .then(res => {
        setUserName(res.data.user_name || '');
      })
      .catch(err => console.error('사용자 정보 조회 실패:', err));
  }, []);

  // ✅ PDF 저장 함수 추가
  const handleDownloadPDF = async () => {
    Chart.register(ArcElement, Tooltip, Legend, PieController);
  
    if (filteredMeals.length === 0) {
      alert('저장할 식단 데이터가 없습니다.');
      return;
    }
  
    const doc = new jsPDF('p', 'mm', 'a4');
  
    // ✅ 폰트 등록
    doc.addFileToVFS('NotoSansKR-Regular.ttf', NotoSansKR);
    doc.addFont('NotoSansKR-Regular.ttf', 'NotoSansKR', 'normal');
    doc.setFont('NotoSansKR');
  
    const today = new Date().toISOString().slice(0, 10);
  
    // --- [1] 커버 페이지 ---
    doc.setFontSize(28);
    doc.text('🍽️ FoodyChat 식단 분석 보고서', 105, 60, { align: 'center' });
  
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(20, 70, 190, 70);
  
    doc.setFontSize(14);
    doc.text(`이름 : ${userName || '사용자'}`, 30, 90);
    doc.text(`검색어 : ${searchPeriod || '기간 없음'}`, 30, 100);
    doc.text(`작성일 : ${today}`, 30, 110);
  
    doc.addPage();
  
    // --- [2] 식단 요약 페이지 ---
    doc.setFontSize(20);
    doc.text('1. 식단 요약', 20, 30);
  
    // ✅ 소제목: AI 건강 피드백
    doc.setFontSize(14);
    doc.setTextColor(78, 115, 223);
    doc.text('🧠 AI 건강 피드백', 20, 45);
    doc.setTextColor(0); // 본문은 검정색 복구
  
    doc.setFontSize(12);
    const summaryText = doc.splitTextToSize(mealSummary || '요약 데이터 없음', 160);
    doc.text(summaryText, 25, 60);
  
    let yAfterSummary = 60 + summaryText.length * 5;
  
    // ✅ 요약 바로 뒤에 Pie Chart 삽입
    const chartImage = await drawPieChart(totalCarbs, totalProtein, totalFat);
  
    if (chartImage) {
      let chartY = yAfterSummary + 10;
      if (chartY + 90 > 280) {
        doc.addPage();
        chartY = 30;
      }
      doc.addImage(chartImage, 'PNG', 55, chartY, 100, 100);
    }
  
    // --- [3] 식단 상세 내역 페이지 ---
    doc.addPage();
    doc.setFontSize(20);
    doc.text('2. 식단 상세 내역', 20, 30);
  
    const tableColumn = ["날짜", "유형", "식단 내용", "칼로리"];
    const tableRows = filteredMeals.map(meal => [
      meal.meal_date || '',
      meal.meal_type_nm || '',
      meal.meal_text || '',
      meal.calories !== undefined ? `${meal.calories} kcal` : ''
    ]);
  
    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      styles: {
        font: 'NotoSansKR',
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        font: 'NotoSansKR',
        fontStyle: 'normal',
        fontSize: 11,
        fillColor: [78, 115, 223],
        textColor: 255,
        halign: 'center',
      },
      bodyStyles: {
        font: 'NotoSansKR',
        fontStyle: 'normal',
        valign: 'middle',
        textColor: [50, 50, 50],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
  
    // ✅ 평균 칼로리, 영양소 퍼센트 계산
    const mealCount = filteredMeals.length;
    const averageCalories = mealCount > 0 ? Math.round(totalCalories / mealCount) : 0;
    const averageCarbs = mealCount > 0 ? Math.round(totalCarbs / mealCount) : 0;
    const averageProtein = mealCount > 0 ? Math.round(totalProtein / mealCount) : 0;
    const averageFat = mealCount > 0 ? Math.round(totalFat / mealCount) : 0;
  
    const totalMacro = totalCarbs + totalProtein + totalFat;
    const carbPercent = totalMacro > 0 ? Math.round((totalCarbs / totalMacro) * 100) : 0;
    const proteinPercent = totalMacro > 0 ? Math.round((totalProtein / totalMacro) * 100) : 0;
    const fatPercent = totalMacro > 0 ? Math.round((totalFat / totalMacro) * 100) : 0;
  
    // ✅ 통계 출력
    let finalY = doc.lastAutoTable.finalY || 50;
    finalY += 10;
  
    doc.setLineWidth(0.5);
    doc.setDrawColor(180);
    doc.line(20, finalY, 190, finalY);
  
    doc.setFontSize(12);
    doc.text(`총 칼로리: ${totalCalories.toLocaleString()} kcal`, 20, finalY + 10);
    doc.text(`평균 칼로리(1끼당): ${averageCalories.toLocaleString()} kcal`, 20, finalY + 20);
    doc.text(`평균 탄수화물: ${averageCarbs}g (${carbPercent}%)`, 20, finalY + 30);
    doc.text(`평균 단백질: ${averageProtein}g (${proteinPercent}%)`, 20, finalY + 40);
    doc.text(`평균 지방: ${averageFat}g (${fatPercent}%)`, 20, finalY + 50);
  
    doc.setLineWidth(0.5);
    doc.setDrawColor(180);
    doc.line(20, finalY + 55, 190, finalY + 55);
  
    // --- [4] 모든 페이지에 푸터 ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(`Generated by FoodyChat   ${i} / ${pageCount}`, 20, pageHeight - 10);
    }
  
    doc.save('meal_report.pdf');
  };

  const drawPieChart = async (totalCarbs, totalProtein, totalFat) => {
    const canvas = document.getElementById('nutritionPieChart');
  
    if (!canvas) {
      console.error('❌ canvas 요소를 찾을 수 없습니다.');
      return null;
    }
  
    if (window.nutritionPieChart instanceof Chart) {
      window.nutritionPieChart.destroy();
      window.nutritionPieChart = null;
    }
  
    const total = totalCarbs + totalProtein + totalFat;
    if (total === 0) {
      console.warn('❗ 차트 생략: 모든 데이터가 0');
      return null;
    }
  
    canvas.style.display = 'block';
    canvas.width = 300;
    canvas.height = 300;
  
    const ctx = canvas.getContext('2d');
  
    window.nutritionPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [
          `탄수화물 (${Math.round((totalCarbs / total) * 100)}%)`,
          `단백질 (${Math.round((totalProtein / total) * 100)}%)`,
          `지방 (${Math.round((totalFat / total) * 100)}%)`
        ],
        datasets: [{
          data: [totalCarbs, totalProtein, totalFat],
          backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e'],
          borderColor: '#ffffff',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'NotoSansKR',
                size: 12,
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value.toLocaleString()}g`;
              }
            }
          }
        }
      }
    });
  
    // ✅ 렌더링 완료 대기
    await new Promise((resolve) => setTimeout(resolve, 500));
  
    try {
      const base64Image = window.nutritionPieChart.toBase64Image();
      canvas.style.display = 'none'; // 다시 숨기기
      return base64Image;
    } catch (err) {
      console.error('❌ 차트 이미지 추출 실패:', err);
      return null;
    }
  };
  

  useEffect(() => {
    axios.get(`${BASE_URL}/users/meals`, { withCredentials: true })
      .then(res => setMeals(res.data))
      .catch(err => console.error('식단 조회 실패:', err));
  }, []);

  const handleViewChange = (type) => {
    setResponseType(type);
    //setFilteredMeals([]); // ✅ 버튼 누르면 기존 데이터도 같이 초기화
  };

  const handleSubmit = async () => {
    setSearchPeriod(query);

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
          ? '테이블과 달력을 모두 보여드릴게요.'
          : '테이블과 달력을 모두 보여드릴게요.'
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
    if (!meals || meals.length === 0) {
      setMealSummary('식단 데이터가 없습니다.');
      return;
    }
  
    try {
      setSummaryLoading(true);
      const res = await axios.post(`${FAST_API_URL}/meal/summary`, meals, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
  
      setMealSummary(res.data.summary || '요약 데이터 없음');
      setTotalCalories(res.data.total_calories || 0);
      setTotalCarbs(res.data.total_carb || 0);
      setTotalProtein(res.data.total_protein || 0);
      setTotalFat(res.data.total_fat || 0);
  
    } catch (error) {
      console.error('❌ 식단 요약 실패', error);
      setMealSummary('요약 생성에 실패했습니다.');
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
                placeholder="기간과 조/중/석 입력 후 보내세요"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? '전송 중...' : '전송'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <canvas
        id="nutritionPieChart"
        width="300"
        height="300"
        style={{ display: 'none', margin: '0 auto' }}
      ></canvas>
    </>
  );
}
