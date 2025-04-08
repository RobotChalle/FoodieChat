import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 👈 페이지 이동을 위해 추가
import './css/login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 👈 페이지 이동 함수

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
        navigate('/myPage');
      }
    } catch (err) {
      setError('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>아이디</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">로그인</button>
    </form>
  );
}

export default Login;
