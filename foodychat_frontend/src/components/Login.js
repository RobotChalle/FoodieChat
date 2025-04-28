import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // 👈 페이지 이동을 위해 추가
import { GoogleLogin } from '@react-oauth/google';
import NavBar from './NavBar';
import { toast } from 'react-toastify';
import './css/login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 👈 페이지 이동 함수
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleGoogleSignup = async (credentialResponse) => {
    try {
        const res = await axios.post(`${BASE_URL}/users/googleLogin`, {
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
        toast.success('로그인 성공!');
        console.log(res.data); // 👈 유저 정보 확인

        // 유저 정보 저장 (예: localStorage)
        localStorage.setItem('user', JSON.stringify(res.data));

        // 페이지 이동
        setTimeout(() => {
          navigate('/');
        }, 1000);
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
        `${BASE_URL}/users/loginUser`, 
        new URLSearchParams({
          email: username,
          user_password: password,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          withCredentials: true,
        }
      );

      toast.success('로그인 성공!');
      console.log(response.data);
    
      // ✅ 로그인 직후 세션이 잘 붙었는지 확인하기
      setTimeout(() => {
        axios.get(`${BASE_URL}/users/ses`, { withCredentials: true })
          .then((res) => {
            console.log('✅ 세션 유저 정보 확인:', res.data);
            localStorage.setItem('user', JSON.stringify(res.data)); // 덮어쓰기
            navigate('/');
          })
          .catch(() => {
            console.warn('⚠️ 세션 확인 실패. 로그인이 유지되지 않을 수 있습니다.');
            navigate('/');
          });
      }, 300); // 💡 300~500ms 정도 딜레이 주면 쿠키 저장 확실
    } catch (err) {
      // 로그인 실패 (401 받았을 때)
      if (err.response && err.response.status === 401) {
        setError('로그인 실패: 이메일 또는 비밀번호가 일치하지 않습니다.');
        toast.error('로그인 실패: 이메일 또는 비밀번호가 일치하지 않습니다.');
      } else {
        setError('서버 오류: 다시 시도해주세요.');
        toast.error('서버 오류 발생');
      }
      console.error('❌ 로그인 에러:', err);
    }
  };

  return (
    <>
    <NavBar />
    <div className="container">
      <div className="text-center">
          <h1> 👨‍🍳 Let’s discover ! <br/> what’s on your plate today! 🍱</h1>
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
    </>
  );
}

export default Login;
