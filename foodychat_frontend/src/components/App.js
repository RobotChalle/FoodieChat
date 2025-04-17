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
import { ToastContainer } from 'react-toastify';
import UserMealSearch from './UserMealSearch';
import Imageanalysis from './ImageAnalysis';
import MealRecommend from './MealRecommend';
import CafeRecommend from './CafeRecommend';
import ChatBot from './ChatBot';

function App() {
  return (
    <GoogleOAuthProvider clientId="758964500028-3l2f9avbost20tq4ri7nr4nfed4fd2l3.apps.googleusercontent.com">

      <Router>
      <div>
        {/* ToastContainer를 여기에 추가 */}
        <ToastContainer 
          position="top-right"
          autoClose={1500} 
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/navbar" element={<NavBar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/user-details" element={<UserDetailsForm />} />
            <Route path="/users/admin" element={<AdminPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/findaccount" element={<FindAccount />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/meal-plan" element={<UserMealSearch />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/image-analysis" element={<Imageanalysis />} />
            <Route path="/meal-recommend" element={<MealRecommend />} />
            <Route path="/cafe-recommend/:foodName" element={<CafeRecommend/>} />
            <Route path="/chatbot" element={<ChatBot/>} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
