import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/main.css';

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    // ✅ 1. localStorage에서 초기화
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUserInfo(parsed);
                console.log("✅ NavBar 초기화 - localStorage 유저", parsed);
            } catch (err) {
                console.warn("❌ localStorage 파싱 실패", err);
            }
        }
    }, []);

    // ✅ 2. 항상 최신 세션 동기화
    useEffect(() => {
        axios.get(`${BASE_URL}/users/ses`, { withCredentials: true })
            .then((res) => {
                if (res.data) {
                    console.log("✅ 세션 동기화 완료:", res.data);
                    setUserInfo(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                }
            })
            .catch(() => {
                console.log('❌ 세션 없음');
                localStorage.removeItem('user');
                setUserInfo(null);
            });
    }, []);

    // 🧪 userInfo 변경 로그
    useEffect(() => {
        console.log('🌀 userInfo 변경:', userInfo);
    }, [userInfo]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
    }, [menuOpen]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && menuOpen) {
                setMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [menuOpen]);

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            await axios.post(`${BASE_URL}/users/logout`, null, {
                withCredentials: true
            });

            localStorage.removeItem('user');
            setUserInfo(null);
            toast.success('로그아웃 되었습니다!');
            setMenuOpen(false);
            navigate('/');
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
                        <Link to="/image-analysis" className="nav-link">🍜 <span>이미지 분석</span></Link>
                        {userInfo && (
                            <Link to="/mypage" className="nav-link">👩‍🍳 <span>마이페이지</span></Link>
                        )}
                        {userInfo && userInfo.membership_level?.toLowerCase() === 'admin' && (
                            <Link to="/users/admin" className="nav-link">🍱 <span>관리자페이지</span></Link>
                        )}
                    </div>

                    <div className="navbar-right desktop-menu">
                        {userInfo ? (
                            <span onClick={handleLogout} className="nav-link logout-link">로그아웃</span>
                        ) : (
                            <>
                                <Link to="/login" className="nav-button">로그인</Link>
                                <Link to="/signup" className="nav-button signup">회원가입</Link>
                            </>
                        )}
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
                <Link to="/image-analysis" onClick={() => setMenuOpen(false)}>🍜 이미지 분석</Link>
                <Link to="/mypage" onClick={() => setMenuOpen(false)}>👩‍🍳 마이페이지</Link>
                {userInfo && userInfo.membership_level?.toLowerCase() === 'admin' && (
                    <Link to="/users/admin" onClick={() => setMenuOpen(false)}>🍱 관리자페이지</Link>
                )}
                {userInfo ? (
                    <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="mobile-logout-button">
                        로그아웃
                    </button>
                ) : (
                    <>
                        <Link to="/login" onClick={() => setMenuOpen(false)}>로그인</Link>
                        <Link to="/signup" onClick={() => setMenuOpen(false)}>회원가입</Link>
                    </>
                )}
            </div>
        </>
    );
}
