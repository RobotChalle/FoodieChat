import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ 꼭 필요합니다
import App from './components/App';
// import './index.css'; // (선택) 스타일 파일

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/foodychat">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);