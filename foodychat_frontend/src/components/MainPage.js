// src/components/MainPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';

import buffet from './img/buffet.jpg';
import laptop from './img/laptop.jpg';
import diet from './img/diet.jpg';
import steak from './img/steak.jpg';
import emptyPlate from './img/empty_plate.jpg';

import './css/main.css';

export default function MainPage() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <NavBar />
      <div className="mainpage-wrapper">
        {/* 메인 배너 */}
        <div className="hero-image-wrapper">
          <img className="responsive-img hero-img-horizontal" src={buffet} alt="뷔페 이미지" />
          <div className="main-text over-hero">
            <h1>오늘, <span>건강하게</span> 먹어볼까요?</h1>
            <p>AI가 추천해주는 나만의 식단을 받아보세요 🍱</p>
            <button onClick={() => navigate('/meal-recommend')}>식단 추천 받기 →</button>
          </div>
        </div>

        {/* 카드 그리드 소개 */}
        <section className="card-section">
          <div className="card-grid">

            {/* 음식 이미지 분석 카드 */}
            <div className="card">
              <img src={diet} alt="식단 관리" className="card-img" />
              <div className="card-content">
                <h3>음식 이미지 분석</h3>
                <p>식사 사진을 업로드하면<br />자동으로 영양 정보까지 확인 가능!</p>
                <button onClick={() => navigate('/image-analysis')}>분석하기</button>
              </div>
            </div>

            {/* 건강 상담 챗봇 카드 */}
            <div className="card">
              <img src={laptop} alt="추천 식당" className="card-img" />
              <div className="card-content">
                <h3>건강 상담 챗봇</h3>
                <p>사용자 정보 기반으로<br />개인화된 건강 상담을 받아보세요.</p>
                <button onClick={() => navigate('/chatbot')}>상담하기</button>
              </div>
            </div>

            {/* AI 식단 추천 카드 */}
            <div className="card">
              <img src={emptyPlate} alt="영양 분석" className="card-img" />
              <div className="card-content">
                <h3>AI 식단 추천</h3>
                <p>AI가 당신의 건강 정보에 맞춰<br />최고의 식단을 설계해줍니다.</p>
                <button onClick={() => navigate('/meal-recommend')}>식단 추천 받기</button>
              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
