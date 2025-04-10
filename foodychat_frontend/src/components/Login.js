import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // 👈 페이지 이동을 위해 추가
import { GoogleLogin } from '@react-oauth/google';
import './css/login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 👈 페이지 이동 함수

  const handleGoogleSignup = async (credentialResponse) => {
    try {
        const res = await axios.post('http://localhost:8080/users/googleLogin', {
            token: credentialResponse.credential,
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (res.status === 200) {
        alert('로그인 성공!');
        console.log(res.data); // 👈 유저 정보 확인

        // 유저 정보 저장 (예: localStorage)
        localStorage.setItem('user', JSON.stringify(res.data));

        // 페이지 이동
        navigate('/');
      }
    } catch (err) {
        console.error(err);
        alert("구글 로그인 실패");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        'http://localhost:8080/users/loginUser', 
        new URLSearchParams({
          email: username,
          user_password: password,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert('로그인 성공!');
        console.log(response.data); // 👈 유저 정보 확인

        // 유저 정보 저장 (예: localStorage)
        localStorage.setItem('user', JSON.stringify(response.data));

        // 페이지 이동
        navigate('/');
      }
    } catch (err) {
      setError('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="text-center">
          <h1>다시 오신 걸 환영합니다</h1>
      </div>
      <form onSubmit={handleLogin}>
          <div className="form-group">
              <input 
                  type="text"
                  className="form-control" 
                  placeholder="이메일*" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
              />
          </div>
          <div className="form-group">
              <input 
                  type="password" 
                  className="form-control" 
                  placeholder="비밀번호*" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
              />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn btn-primary">계속</button>
          
          <div className="find-account-links">
              <Link to="/findaccount" className="small">이메일 찾기 | 비밀번호 찾기</Link>
          </div>
          
          <div className="divider">또는</div>
          
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log('구글 로그인 성공', credentialResponse);
              handleGoogleSignup(credentialResponse); // ✅ 이 줄을 추가
            }}
            onError={() => {
              console.log('구글 로그인 실패');
            }}
          />
      </form>
      <div className="text-center footer-links">
          <Link to="/terms" className="small">이용약관</Link>
          <span className="divider-vertical">|</span>
          <Link to="/privacy" className="small">개인정보 보호 정책</Link>
      </div>
    </div>
  );
}

export default Login;
