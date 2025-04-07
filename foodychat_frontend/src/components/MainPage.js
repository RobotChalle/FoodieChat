import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/main.css';

function MainPage() {
  const navigate = useNavigate();

  const handleMoveToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="login-page">
      <button className="login-button" onClick={handleMoveToLogin}>로그인</button>
    </div>
  );
}

export default MainPage;