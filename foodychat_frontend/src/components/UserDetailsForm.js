// src/components/UserDetailsForm.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDetailsForm = () => {
  const [details, setDetails] = useState({
    gender: "",
    age: "",
    user_weight: "",
    height: "",
    user_address: "",
    health_goal: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/users/details", details);
      alert("정보 입력 성공!");
      navigate("/main"); // 메인 페이지나 다른 화면으로 이동
    } catch (err) {
      alert("정보 저장 실패");
    }
  };
  //카카오맵 API
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        const address = data.address;
        setDetails(prev => ({ ...prev, user_address: address }));
      }
    }).open();
  };
  
  return (
    <div>
      <h2>추가 정보 입력</h2>
      <select name="gender" onChange={handleChange}>
        <option value="">성별 선택</option>
        <option value="male">남성</option>
        <option value="female">여성</option>
      </select><br />
      <input name="age" type="number" placeholder="나이" onChange={handleChange} /><br />
      <input name="user_weight" type="number" placeholder="몸무게(kg)" onChange={handleChange} /><br />
      <input name="height" type="number" placeholder="키(cm)" onChange={handleChange} /><br />
      <input type="text" id="user_address" name="user_address" placeholder="주소" readOnly value={details.user_address} />
      <button type="button" onClick={handleAddressSearch}>주소 검색</button>
      <input name="health_goal" placeholder="건강 목표" onChange={handleChange} /><br />
      <button onClick={handleSubmit}>제출</button>
    </div>
  );
};

export default UserDetailsForm;
