import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import './css/main.css';

export default function MainPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
        await axios.post('http://localhost:8080/users/logout', 
            new URLSearchParams({
              user_id: userInfo.user_id,
            }),
            {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              withCredentials: true,
            }
        );

        // 로그아웃 성공 시 처리
        localStorage.removeItem('user');
        navigate('/login');
    } catch (err) {
        console.error('로그아웃 실패:', err);
        alert('로그아웃 중 오류가 발생했습니다.');
    }
};

  return (
    <>
      <NavBar />
    </>
  );
}