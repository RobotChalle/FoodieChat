import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Login from './Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;