// src/components/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Login from './Login';
import SignupForm from './SignupForm';
import { GoogleOAuthProvider } from '@react-oauth/google';
import UserDetailsForm from './UserDetailsForm';

function App() {
  return (
    <GoogleOAuthProvider clientId="758964500028-3l2f9avbost20tq4ri7nr4nfed4fd2l3.apps.googleusercontent.com"> {/* 여기에 본인 clientId 입력 */}
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/user-details" element={<UserDetailsForm />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
