import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import MyPage from './MyPage';
import ChangePassword from './ChangePassword';
import Login from './Login';
import FindAccount from './FindAccount';
import ResetPassword from './ResetPassword';
import AdminPage from './AdminPage';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="758964500028-3l2f9avbost20tq4ri7nr4nfed4fd2l3.apps.googleusercontent.com"> {/* 여기에 본인 clientId 입력 */}
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/findaccount" element={<FindAccount />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/users" element={<AdminPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;