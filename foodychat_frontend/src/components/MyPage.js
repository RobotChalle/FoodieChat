import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import './css/mypage.css';
import './css/main.css';
import InputMask from 'react-input-mask';

export default function Mypage() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const [phone, setPhone] = useState('');
    const [formData, setFormData] = useState({ age: '', weight: '', height: '', address: '', addressDetail: '' });
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const handleAddressSearch = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function (data) {
                    const address = data.address;
                    setFormData(prev => ({ ...prev, address }));
                }
            }).open();
        } else {
            alert("주소 검색 모듈을 불러오는 데 실패했습니다. 페이지를 새로고침 해주세요.");
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem('myPageForm');
        const localForm = saved ? JSON.parse(saved) : null;
      
        const fetchUserInfo = async () => {
          try {
            const response = await axios.post(`${BASE_URL}/users/myPage`, {}, {
              withCredentials: true
            });
      
            if (response.status === 200) {
              setUserInfo(response.data);
      
              // 🔄 서버 값 + localStorage 병합
              const merged = {
                age: response.data.age,
                weight: response.data.user_weight,
                height: response.data.height,
                address: response.data.user_address || '',
                addressDetail: response.data.address_detail || ''
              };
      
              // localStorage 값이 있다면 병합해서 덮어쓰기
              setFormData(localForm ? { ...merged, ...localForm } : merged);
            }
          } catch (err) {
            setError('정보를 불러오는데 실패 했습니다.');
            console.error(err);
          }
        };
      
        fetchUserInfo();
    }, []);
      
    useEffect(() => {
        if (userInfo?.phone) {
            setPhone(userInfo.phone);
        }
    }, [userInfo]);

    const handleLogout = async () => {
        try {
            await axios.post(`${BASE_URL}/users/logout`, null, {
                withCredentials: true
            });

            localStorage.removeItem('user');
            localStorage.removeItem('myPageForm');
            navigate('/');
            window.location.reload(); // ✅ NavBar 상태 갱신 보장
        } catch (err) {
            console.error('로그아웃 실패:', err);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const payload = new URLSearchParams({
                user_id: userInfo.user_id,
                user_name: userInfo.user_name,
                phone,
                age: formData.age,
                user_weight: formData.weight,
                height: formData.height,
                user_address: formData.address,
                address_detail: formData.addressDetail
            });

            const response = await axios.post(`${BASE_URL}/users/updateUser`, payload, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                withCredentials: true
            });

            // ✅ localStorage에 저장
            localStorage.setItem('myPageForm', JSON.stringify(formData));

            if (response.status === 200) {
                alert('정보가 성공적으로 저장되었습니다.');
            }
        } catch (err) {
            console.error('저장 실패:', err);
            alert('정보 저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <>
            <NavBar />
            <div className="mypage-wrapper">
                <div className="mypage-inner">
                    <h1 className="mypage-title">My Page</h1>
                    <div className="mypage-grid-container">
                        <div className="mypage-grid-row profile">
                            <div className="profile-sidebar">
                                {userInfo && (
                                    <>
                                        <div className="profile-picture">
                                        </div>
                                        <h3>{userInfo.user_name}</h3>
                                        <p>{userInfo.email}</p>
                                        <p>회원등급: {userInfo.membership_level}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mypage-grid-row info">
                            <div className="mypage-content">
                                {error && <p className="error-message">{error}</p>}
                                {userInfo && <h2 className="mypage-title">내 정보</h2>}

                                <div className="form-section">
                                    <div className="form-pair">
                                        <div className="form-group">
                                            <label>이름</label>
                                            <input
                                                type="text"
                                                value={userInfo?.user_name || ''}
                                                disabled
                                            />
                                            <small className="helper-text">가입 시 입력된 이름입니다.</small>
                                        </div>
                                        <div className="form-group">
                                            <label>연락처</label>
                                            <InputMask
                                                mask="999-9999-9999"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            >
                                                {(inputProps) => <input type="text" {...inputProps} />}
                                            </InputMask>
                                            <small className="helper-text">'-' 이 자동으로 입력됩니다</small>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="gender">성별</label>
                                            <select id="gender" value={userInfo?.gender || ''} disabled>
                                                <option value="1">남성</option>
                                                <option value="2">여성</option>
                                            </select>
                                            <small className="helper-text">가입 시 선택된 성별입니다.</small>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group full-width">
                                        <label htmlFor="address">주소</label>
                                        <div className="address-input-wrap">
                                            <input
                                                type="text"
                                                name="address"
                                                placeholder="도로명 주소"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                            <button
                                                type="button"
                                                className="address-button"
                                                onClick={handleAddressSearch}
                                                > 
                                                주소 검색
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            name="addressDetail"
                                            placeholder="상세 주소 (예: 아파트 동/호수)"
                                            value={formData.addressDetail}
                                            onChange={handleInputChange}
                                            className="detail-address-input"
                                        />
                                        <small className="helper-text">정확한 주소를 입력해주세요.</small>
                                    </div>


                                    <div className="form-triple">
                                        <div className="form-group">
                                            <label htmlFor="age">나이</label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                inputMode="numeric"
                                                pattern="\d*"
                                                min="0"
                                            />
                                            <small className="helper-text">정확한 나이를 입력해주세요.</small>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="weight">체중 (kg)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleInputChange}
                                                inputMode="numeric"
                                                pattern="\d*"
                                                min="0"
                                            />
                                            <small className="helper-text">예: 65.5</small>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="height">키 (cm)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="height"
                                                value={formData.height}
                                                onChange={handleInputChange}
                                                inputMode="numeric"
                                                pattern="\d*"
                                                min="0"
                                            />
                                            <small className="helper-text">예: 175.2</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mypage-grid-row actions">
                            <div className="mypage-button-group">
                                <button onClick={handleSave} className="button">저장</button>
                                <button onClick={() => navigate('/change-password')} className="button secondary">비밀번호 변경</button>
                                {userInfo && userInfo.membership_level?.toLowerCase() !== 'regular' && (
                                    <button onClick={() => navigate('/meal-plan')} className="button secondary">식단 조회</button>
                                )}
                                <button onClick={handleLogout} className="button logout">로그아웃</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
