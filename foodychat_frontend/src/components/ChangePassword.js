import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './css/change-password.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;
export default function ChangePassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
        setMessage('새 비밀번호가 일치하지 않습니다.');
        return;
        }

        try {
        const response = await axios.post(`${BASE_URL}/users/changePassword`, 
            new URLSearchParams({
                currentPassword: currentPassword,
                newPassword: newPassword,
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                withCredentials: true,
            }
        );

        if (response.status === 200) {
            setMessage('비밀번호가 성공적으로 변경되었습니다.');
            setTimeout(() => navigate('/myPage'), 1500);
        }
        } catch (err) {
            console.error(err);
            setMessage('비밀번호 변경에 실패했습니다.');
        }
    };

    return (
        <>
        <NavBar />
        <div className="change-password-wrapper">
            <form onSubmit={handleSubmit} className="change-password-form">
            <h2>비밀번호 변경</h2>
            {message && <p className="message">{message}</p>}

            <label>
                현재 비밀번호
                <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                />
            </label>

            <label>
                새 비밀번호
                <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                />
            </label>

            <label>
                새 비밀번호 확인
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
            </label>

            <button type="submit" className="change-button">변경하기</button>
            </form>
        </div>
        </>
    );
}
