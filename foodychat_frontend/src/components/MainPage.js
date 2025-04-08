import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/main.css';

export default function MainPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  return (
    <>
      <nav className="glass-navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="logo">🍽 <span>FoodyChat</span></Link>
          </div>

          <div className="navbar-center desktop-menu">
            <Link to="/chatbot" className="nav-link">🤖 <span>챗봇</span></Link>
            <Link to="/image-analysis" className="nav-link">🍱 <span>이미지 분석</span></Link>
            <Link to="/mypage" className="nav-link">🍱 <span>마이페이지</span></Link>
            <Link to="/adminpage" className="nav-link">🍱 <span>관리자페이지</span></Link>
          </div>

          <div className="navbar-right desktop-menu">
            <Link to="/login" className="nav-button">로그인</Link>
            <Link to="/signup" className="nav-button signup">회원가입</Link>
            <button
              className="darkmode-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Dark mode toggle"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          <div
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu toggle"
          >
            <span />
            <span />
            <span />
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'show' : ''}`}>
        <Link to="/chatbot" onClick={() => setMenuOpen(false)}>🤖 챗봇</Link>
        <Link to="/image-analysis" onClick={() => setMenuOpen(false)}>🍱 이미지 분석</Link>
        <Link to="/mypage" onClick={() => setMenuOpen(false)}>🍱 마이페이지</Link>
        <Link to="/adminpage" onClick={() => setMenuOpen(false)}>🍱 관리자페이지</Link>
        <Link to="/login" onClick={() => setMenuOpen(false)}>로그인</Link>
        <Link to="/signup" onClick={() => setMenuOpen(false)}>회원가입</Link>
      </div>
    </>
  );
}