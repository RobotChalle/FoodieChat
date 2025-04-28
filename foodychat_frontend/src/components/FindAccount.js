import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/findaccount.css';
import InputMask from 'react-input-mask';

export default function FindAccount() {
    const [activeTab, setActiveTab] = useState('id'); // 'id' 또는 'password'
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (activeTab === 'id') {
                const response = await axios.post(`${BASE_URL}/users/findId`, 
                    new URLSearchParams({
                        user_name: name,
                        phone: phone
                    }),
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        withCredentials: true,
                    }, {
                });
                setSuccess(<span className="clickable-email" onClick={() => {
                    setActiveTab('password');
                    setEmail(response.data);
                }}>이메일 : {response.data}</span>);                
            } else {
                const response = await axios.post(`${BASE_URL}/users/findPassword`, 
                    new URLSearchParams({
                        email: email
                    }),
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        withCredentials: true,
                    },{
                });
                setSuccess('비밀번호 재설정 링크를 이메일로 전송했습니다.');
            }
        } catch (err) {
            if (err.response?.data) {
                setError(err.response.data);  // ❗ 서버가 준 메시지 그대로 표시
            } else {
                setError('알 수 없는 오류가 발생했습니다.');
            }
            console.error(err);
        }
    };

    return (
        <div className="container">
            <div className="text-center">
                <h1>계정 찾기</h1>
            </div>
            <div className="tabs">
                <button 
                    className={`tab-button ${activeTab === 'id' ? 'active' : ''}`}
                    onClick={() => setActiveTab('id')}
                >
                    아이디 찾기
                </button>
                <button 
                    className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                >
                    비밀번호 찾기
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                {activeTab === 'id' ? (
                    <>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="이름*"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                onInvalid={(e) => e.target.setCustomValidity('이름을 입력하세요')}
                                onInput={(e) => e.target.setCustomValidity('')}
                            />
                        </div>
                        <div className="form-group">
                            <InputMask
                                mask="999-9999-9999"
                                className="form-control"
                                placeholder="전화번호*"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            >
                                {(inputProps) => <input type="text" {...inputProps} />}
                            </InputMask>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="이메일 주소*"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                onInvalid={(e) => e.target.setCustomValidity('이메일 주소를 입력하세요')}
                                onInput={(e) => e.target.setCustomValidity('')}
                            />
                        </div>
                    </>
                )}
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <button type="submit" className="btn btn-primary">
                    {activeTab === 'id' ? '아이디 찾기' : '비밀번호 찾기'}
                </button>
            </form>
            <div className="text-center" style={{ marginTop: '20px' }}>
                <Link to="/login" className="small">로그인으로 돌아가기</Link>
            </div>
        </div>
    );
}