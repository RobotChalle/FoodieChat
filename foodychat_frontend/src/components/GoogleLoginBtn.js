import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginBtn = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const handleLoginSuccess = async (credentialResponse) => {
    const res = await axios.post(`${BASE_URL}/api/auth/google`, {
    //const res = await axios.post('http://192.168.0.29:8080/api/auth/google', {
      token: credentialResponse.credential
    });
    localStorage.setItem("token", res.data.token);
    alert("로그인 성공!");
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => alert("로그인 실패")}
    />
  );
};

export default GoogleLoginBtn;
