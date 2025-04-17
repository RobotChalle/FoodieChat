import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import NavBar from './NavBar';
import 'react-tooltip/dist/react-tooltip.css';
import './css/chatbot.css';

export default function ChatBot() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const storedName = localStorage.getItem('user_name');
    if (storedName) setUserName(storedName);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
    <NavBar />
    <div className={`chatbot-wrapper ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="chatbot-main">
        <div className="chat-feature-panel">
          <h2>📊 기능 패널</h2>
          <p>여기에 다양한 분석 도구가 들어갈 수 있습니다.</p>
        </div>

        <div className="chatbot-panel">
          <div className="chat-title-bar">
            <span className="chat-icon">💬</span>
            <h3 className="chat-title">챗봇</h3>
          </div>

          <div className="chatbot-window">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              placeholder="메시지를 입력하세요..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
