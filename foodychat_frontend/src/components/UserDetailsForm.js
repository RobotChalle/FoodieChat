import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/signup2.css'; // 스타일 파일

export default function Signup2() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        user_id: null,
        gender: '',
        age: '',
        height: '',
        user_weight: '',
        user_address: '',
        health_goal: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // 👉 컴포넌트 마운트 시 user_id 불러오기
    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId && !isNaN(storedUserId)) {
            setFormData(prev => ({
                ...prev,
                user_id: parseInt(storedUserId, 10)
            }));
        } else {
            setError('유효하지 않은 사용자 ID입니다. 다시 로그인해주세요.');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                const address = data.address;
                setFormData(prev => ({ ...prev, user_address: address }));
            }
        }).open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.user_id) {
            setError('회원 정보가 유효하지 않습니다. 다시 로그인해주세요.');
            return;
        }

        try {
            await axios.post('http://localhost:8080/users/details', formData);
            setSuccess('건강 정보가 성공적으로 저장되었습니다!');
            setTimeout(() => navigate('/main'), 2000);
        } catch (err) {
            setError('정보 저장 실패: 다시 시도해주세요.');
            console.error(err);
        }
    };

    return (
        <div className="container">
            <div className="text-center">
                <h1>추가 건강 정보 입력</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>성별</label>
                    <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-control"
                    required
                    >
                      <option value="">선택</option>
                      <option value="1">남성</option>
                      <option value="2">여성</option>
                      <option value="3">기타</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>나이</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>키(cm)</label>
                    <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>몸무게(kg)</label>
                    <input
                        type="number"
                        name="user_weight"
                        value={formData.user_weight}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>주소</label>
                    <div className="input-group">
                        <input
                            type="text"
                            name="user_address"
                            value={formData.user_address}
                            onChange={handleChange}
                            className="form-control"
                            readOnly
                        />
                        <div className="input-group-append">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleAddressSearch}
                            >
                                주소 검색
                            </button>
                        </div>
                    </div>
                </div>

                <select
                  name="health_goal"
                  value={formData.health_goal}
                  onChange={handleChange}
                  className="form-control"
                  required>
                    <option value="">선택</option>
                    <option value="1">체중 감량</option>
                    <option value="2">근육 증가</option>
                    <option value="3">건강 유지</option>
                    </select>


                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {success && <div className="alert alert-success mt-3">{success}</div>}

                <button type="submit" className="btn btn-primary mt-4 w-100">제출하기</button>
            </form>
        </div>
    );
}
