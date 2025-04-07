import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        'http://localhost:8080/users/login',
        {
          user_name: username,
          user_password: password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
  
      if (response.status === 200) {
        alert('로그인 성공!');
        console.log(response.data);
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
          class="pw"
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
