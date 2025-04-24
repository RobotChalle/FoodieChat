import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import './css/signup2.css';

export default function Signup2() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
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

                // ✅ 유효성 수동 초기화
                const addressInput = document.querySelector('input[name="user_address"]');
                if (addressInput) {
                    addressInput.setCustomValidity('');
                }
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
            const response = await axios.post(`${BASE_URL}/users/details`, formData);
            if (response.status === 200) {
                setSuccess('건강 정보가 성공적으로 저장되었습니다!');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }
        } catch (error) {
            console.error("저장 중 오류 발생:", error);
            setError('저장 중 오류가 발생했습니다.');
        }
    };

    return (
      <>
      <NavBar />
      <div className="container">
        <div className="text-center">
          <h1>추가 건강 정보 입력</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-control"
              required
              onInvalid={(e) => e.target.setCustomValidity('성별을 선택하세요')}
              onInput={(e) => e.target.setCustomValidity('')}
            >
              <option value="">성별 선택*</option>
              <option value="1">남성</option>
              <option value="2">여성</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="number"
              name="age"
              placeholder="나이*"
              value={formData.age}
              onChange={handleChange}
              className="form-control"
              required
              onInvalid={(e) => e.target.setCustomValidity('나이를 입력하세요')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="height"
              placeholder="키 (cm)*"
              value={formData.height}
              onChange={handleChange}
              className="form-control"
              required
              onInvalid={(e) => e.target.setCustomValidity('키를 입력하세요')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="user_weight"
              placeholder="몸무게 (kg)*"
              value={formData.user_weight}
              onChange={handleChange}
              className="form-control"
              required
              onInvalid={(e) => e.target.setCustomValidity('몸무게를 입력하세요')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
          </div>

          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                name="user_address"
                placeholder="주소*"
                value={formData.user_address}
                onChange={handleChange}
                className="form-control"
                required
                onInvalid={(e) => e.target.setCustomValidity('주소를 입력하세요')}
                onInput={(e) => e.target.setCustomValidity('')}
              />
              <div className="input-group-append">
                <button
                    type="button"
                    className="btn btn-outline-secondary align-middle"
                    onClick={handleAddressSearch}
                >
                    주소 검색
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <select
              name="health_goal"
              value={formData.health_goal}
              onChange={handleChange}
              className="form-control"
              required
              onInvalid={(e) => e.target.setCustomValidity('건강목표를 선택하세요')}
              onInput={(e) => e.target.setCustomValidity('')}
            >
              <option value="">건강 목표*</option>
              <option value="1">체중 감량</option>
              <option value="2">근육 증가</option>
              <option value="3">건강 유지</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="btn btn-primary w-100">제출하기</button>
        </form>
      </div>
    </>
    );
}
