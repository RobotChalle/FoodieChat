import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import MyPage from './MyPage';
import ChangePassword from './ChangePassword';
import Login from './Login';
import SignupForm from './SignupForm';
import { GoogleOAuthProvider } from '@react-oauth/google';
import UserDetailsForm from './UserDetailsForm';
import AdminPage from './AdminPage';
import NavBar from './NavBar';
import FindAccount from './FindAccount';
import ResetPassword from './ResetPassword';

function App() {
  return (
    <GoogleOAuthProvider clientId="758964500028-3l2f9avbost20tq4ri7nr4nfed4fd2l3.apps.googleusercontent.com">

      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/user-details" element={<UserDetailsForm />} />
          <Route path="/admin/users" element={<AdminPage />} />
          <Route path="/navbar" element={<NavBar />} />
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
