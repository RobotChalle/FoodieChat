import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom"; // ⬅️ 추가

const SignupForm = () => {
  const [form, setForm] = useState({
    email: "",
    user_password: "",
    user_name: "",
    phone: ""
  });

  const navigate = useNavigate(); // ⬅️ 추가

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:8080/users/signup", form);
      alert("회원가입 성공!");
      navigate("/user-details"); // ⬅️ 회원가입 성공 후 이동
    } catch (err) {
      alert("회원가입 실패");
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:8080/users/google", {
        token: credentialResponse.credential,
      });
      alert("구글 회원가입 성공!");
      navigate("/user-details"); // ⬅️ 구글 회원가입 성공 후 이동
    } catch (err) {
      alert("구글 회원가입 실패");
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <input
        name="email"
        placeholder="이메일"
        value={form.email}
        onChange={handleChange}
        /><br />
      <input
      name="user_password"
      type="user_password"
      placeholder="비밀번호"
      value={form.user_password}
      onChange={handleChange}
      /><br />
      <input
      name="user_name"
      placeholder="이름"
      value={form.user_name}
      onChange={handleChange}
        /><br />
        <input
        name="phone"
        placeholder="전화번호"
        value={form.phone}
        onChange={handleChange}
        /><br />
      <button onClick={handleSignup}>일반 회원가입</button>

      <hr />
      <GoogleLogin
        onSuccess={handleGoogleSignup}
        onError={() => alert("구글 로그인 실패")}
      />
    </div>
  );
};

export default SignupForm;
