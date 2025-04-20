import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/resetpassword.css'; // 스타일은 별도 정의

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        if (!token) {
            setError('유효하지 않은 비밀번호 재설정 링크입니다.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await axios.post(`${BASE_URL}/users/resetPassword`, 
                new URLSearchParams({
                    token: token,
                    newPassword: password
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    withCredentials: true
                }
            );
            setSuccess('비밀번호가 성공적으로 변경되었습니다. 로그인 화면으로 이동합니다.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message,'비밀번호 재설정에 실패했습니다. 토큰이 만료되었거나 유효하지 않습니다.');
            console.error(err);
        }
    };

    return (
        <div className="reset-password-container">
            <h2>비밀번호 재설정</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            {!success && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="새 비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group btn-position" >
                        <button type="submit" className="btn btn-primary" style={{margin : "0px", }}>비밀번호 재설정</button> 
                    </div>
                </form>
            )}
        </div>
    );
}
