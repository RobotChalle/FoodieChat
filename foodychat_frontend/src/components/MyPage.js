import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import './css/mypage.css';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';

export default function Mypage() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const [phone, setPhone] = useState('');
    const [formData, setFormData] = useState({ age: '', weight: '', height: '', address: '', addressDetail: '', user_name: '', gender: '', });
    const navigate = useNavigate();

    const handleAddressSearch = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function (data) {
                    const address = data.address;
                    setFormData(prev => ({ ...prev, address }));
                }
            }).open();
        } else {
            toast.error('주소 검색 모듈을 불러오는 데 실패했습니다. 페이지를 새로고침 해주세요.', {
                position: "bottom-right",
                autoClose: 1000
            });
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem('myPageForm');
        const localForm = saved ? JSON.parse(saved) : null;

        const fetchUserInfo = async () => {
            try {
                const response = await axios.post("http://localhost:8080/users/myPage", {}, {
                    withCredentials: true
                });
                console.error(response.data);
                if (response.status === 200) {
                    setUserInfo(response.data);

                    const merged = {
                        user_name: response.data.user_name,
                        gender: response.data.gender,
                        age: response.data.age,
                        weight: response.data.user_weight,
                        height: response.data.height,
                        address: response.data.user_address || '',
                        addressDetail: response.data.address_detail || ''
                    };

                    setFormData(localForm ? { ...merged, ...localForm } : merged);
                }
            } catch (err) {
                toast.error('정보를 불러오는데 실패 했습니다.', {
                    position: "bottom-right",
                    autoClose: 1000
                });
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
            await axios.post('http://localhost:8080/users/logout',
                new URLSearchParams({
                    user_id: userInfo.user_id,
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    withCredentials: true,
                }
            );

            localStorage.removeItem('user');
            navigate('/login');
        } catch (err) {
            console.error('로그아웃 실패:', err);
            toast.error('로그아웃 중 오류가 발생했습니다.', {
                position: "bottom-right",
                autoClose: 1000
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        // ✅ 빈 항목 체크 리스트
        if (!formData.user_name) {
            toast.error('이름을 입력해주세요.', {
                position: "bottom-right",
                autoClose: 1000
            });
            return;
        }
        if (!phone) {
            toast.error('연락처를 입력해주세요.', {
                position: "bottom-right",
                autoClose: 1000
            });
            return;
        }
        if (!formData.gender) {
            toast.error('성별을 선택해주세요.', {
                position: "bottom-right",
                autoClose: 1000
            });
            return;
        }
        if (!formData.address) {
            toast.error('주소를 입력해주세요.', {
                position: "bottom-right",
                autoClose: 1000
            });
            return;
        }
        if (!formData.age) {
            toast.error('나이를 입력해주세요.', {
                position: "bottom-right",
                autoClose: 1000
            });
            return;
        }
        if (!formData.weight) {
            toast.error('체중을 입력해주세요.', {
                position: "bottom-right",
                autoClose: 1000
            });
            return;
        }
        if (!formData.height) {
            toast.error('키를 입력해주세요.', {
                position: "bottom-right",
                autoClose: 1000
            });
            return;
        }

        try {
            const payload = new URLSearchParams({
                user_id: userInfo.user_id,
                user_name: formData.user_name,
                gender: formData.gender,
                phone,
                age: formData.age,
                user_weight: formData.weight,
                height: formData.height,
                user_address: formData.address,
                address_detail: formData.addressDetail
            });

            const response = await axios.post('http://localhost:8080/users/updateUser', payload, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                withCredentials: true
            });

            localStorage.setItem('myPageForm', JSON.stringify(formData));

            if (response.status === 200) {
                toast.success('정보가 성공적으로 저장되었습니다.', {
                    position: "bottom-right",
                    autoClose: 1000
                });
            }
        } catch (err) {
            console.error('저장 실패:', err);
            toast.error('정보 저장 중 오류가 발생했습니다.', {
                position: "bottom-right",
                autoClose: 1000
            });
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
                                                name="user_name"
                                                value={formData.user_name}
                                                onChange={handleInputChange}
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
                                            <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
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
                            <div className="mypage-button-group"> {/* ✅ 버튼 간격 반영 */}
                                <button onClick={handleSave} className="button primary">저장</button>
                                {userInfo && !(userInfo.google_id && userInfo.google_id.trim() !== '') && (
                                  <button onClick={() => navigate('/change-password')} className="button secondary">
                                    비밀번호 변경
                                  </button>
                                )}
                                {userInfo && userInfo.membership_level?.toLowerCase() !== 'regular' && (
                                    <button onClick={() => navigate('/meal-plan')} className="button logout">식단 조회</button> // ✅ 빨간색 버튼
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
