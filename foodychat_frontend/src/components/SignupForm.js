import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import { GoogleLogin } from '@react-oauth/google';
import './css/signup.css';

export default function Signup() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [form, setForm] = useState({
        user_name: '',
        email: '',
        user_password: '',
        confirmPassword: '',
        phone: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.user_password !== form.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post(
                `${BASE_URL}/users/signup`,
                {
                    user_name: form.user_name,
                    email: form.email,
                    user_password: form.user_password,
                    phone: form.phone
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                const userId = response.data.user_id;
                console.error(userId);
                if (!userId) {
                    setError('서버로부터 사용자 ID를 받지 못했습니다.');
                    return;
                }

                localStorage.setItem("user_id", userId);
                setSuccess('회원가입이 완료되었습니다!');
                setTimeout(() => {
                    navigate('/user-details');
                }, 1000);
            }
        } catch (err) {
            console.error(err);
            setError('회원가입 실패: ' + (err.response?.data?.message || '알 수 없는 오류'));
        }
    };

    const handleGoogleSignup = async (credentialResponse) => {
        try {
            const res = await axios.post(`${BASE_URL}/users/google`, {
                token: credentialResponse.credential,
            });

            const userId = res.data.user_id;

            if (!userId) {
                alert("서버로부터 사용자 ID를 받지 못했습니다.");
                return;
            }

            localStorage.setItem("user_id", userId);
            alert("구글 회원가입 성공!");
            navigate('/user-details');
        } catch (err) {
            console.error(err);
            alert("구글 회원가입 실패");
        }
    };

    return (
        <>
            <NavBar />        
            <div className="container">
                <div className="text-center">
                    <h1>🌱 Start your healthy eating 🧑‍⚕</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="이름*"
                            name="user_name"
                            value={form.user_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="이메일*"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="비밀번호*"
                            name="user_password"
                            value={form.user_password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="비밀번호 확인*"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="tel"
                            className="form-control"
                            placeholder="전화번호*"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="btn btn-primary">계속</button>

                    <div className="terms-text">
                        회원가입 시 <Link to="/terms">이용약관</Link>과 <br /><Link to="/privacy">개인정보 보호정책</Link>에 동의하는 것으로 간주됩니다.
                    </div>

                    <hr />
                    <GoogleLogin
                        onSuccess={handleGoogleSignup}
                        onError={() => alert("구글 로그인 실패")}
                    />
                </form>
            </div>
        </>
    );
}
