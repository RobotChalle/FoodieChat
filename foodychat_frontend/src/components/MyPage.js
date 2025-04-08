import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import './css/mypage.css';

export default function Mypage() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/logout', {}, {
                withCredentials: true, // 쿠키 포함
            });
        
            // 로그아웃 성공 → 로그인 페이지로 이동
            navigate('/login');
        } catch (err) {
            console.error('로그아웃 실패:', err);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:8080/users/myPage', // 백엔드 마이페이지 엔드포인트
                    {
                        withCredentials: true
                    }
                );

                if (response.status === 200) {
                    setUserInfo(response.data);
                }
            } catch (err) {
                setError('정보를 불러오는데 실패 했습니다.');
                console.error(err);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <>
            <NavBar />

            <div className="mypage-wrapper">
                <div className="mypage-box">
                    <h2 className="mypage-title">마이페이지</h2>

                    {error && <p className="error-message">{error}</p>}

                    {userInfo ? (
                        <div className="info-section">
                            <p><strong>이름:</strong> {userInfo.user_name}</p>
                            <p><strong>이메일:</strong> {userInfo.email}</p>
                            <p><strong>아이디:</strong> {userInfo.user_id}</p>
                            <p><strong>전화번호:</strong> {userInfo.phone}</p>
                            <p><strong>회원등급:</strong> {userInfo.membership_lvl}</p>
                            <p><strong>성별:</strong> {userInfo.gender}</p>
                            <p><strong>키:</strong> {userInfo.height} cm</p>
                            <p><strong>몸무게:</strong> {userInfo.user_weight} kg</p>
                            <p><strong>주소:</strong> {userInfo.user_address}</p>
                            <p><strong>가입일시:</strong> {userInfo.reg_date}</p>
                            <p><strong>수정일시:</strong> {userInfo.upd_date}</p>
                        </div>
                    ) : (
                        <p>정보를 불러오는 중...</p>
                    )}

                    <button onClick={() => navigate('/change-password')} className="mypage-button">
                        비밀번호 변경
                    </button>

                    <button onClick={handleLogout} className="mypage-button secondary">
                        로그아웃
                    </button>
                </div>
            </div>
        </>
    );
}
