import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/main.css';

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserInfo(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
    }, [menuOpen]);

    const handleLogout = async () => {
        try {
            await axios.post(
                'http://localhost:8080/users/logout',
                new URLSearchParams({ user_id: userInfo.user_id }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    withCredentials: true,
                }
            );

            localStorage.removeItem('user');
            toast.success('로그아웃 되었습니다!');
            setUserInfo(null);

            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (err) {
            console.error('로그아웃 실패:', err);
            toast.error('로그아웃 중 오류가 발생했습니다.');
        }
    };

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
                        {userInfo && userInfo.membership_lvl !== 'admin' && (
                            <Link to="/mypage" className="nav-link">🍱 <span>마이페이지</span></Link>
                        )}
                        <Link to="/mypage" className="nav-link">🍱 <span>마이페이지</span></Link>
                        {userInfo && userInfo.membership_lvl === 'admin' && (
                            <Link to="/adminpage" className="nav-link">🍱 <span>관리자페이지</span></Link>
                        )}
                        {userInfo && (
                            <button onClick={handleLogout} className="nav-button logout">로그아웃</button>
                        )}
                    </div>

                    <div className="navbar-right desktop-menu">
                        {!userInfo && (
                            <>
                                <Link to="/login" className="nav-button">로그인</Link>
                                <Link to="/signup" className="nav-button signup">회원가입</Link>
                            </>
                        )}
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
                {userInfo && userInfo.membership_lvl !== 'admin' && (
                    <Link to="/mypage" onClick={() => setMenuOpen(false)}>🍱 마이페이지</Link>
                )}
                {userInfo && userInfo.membership_lvl === 'admin' && (
                    <Link to="/adminpage" onClick={() => setMenuOpen(false)}>🍱 관리자페이지</Link>
                )}
                {userInfo && (
                    <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="mobile-logout-button">
                        로그아웃
                    </button>
                )}
                {!userInfo && (
                    <>
                        <Link to="/login" onClick={() => setMenuOpen(false)}>로그인</Link>
                        <Link to="/signup" onClick={() => setMenuOpen(false)}>회원가입</Link>
                    </>
                )}
            </div>

            {/* 토스트 메시지 표시 */}
            <ToastContainer position="top-right" autoClose={2000} />
        </>
    );
}
