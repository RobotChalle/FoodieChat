import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBar from './NavBar';
import './css/chatbot.css';

function ChatBot() {
  const [userId, setUserId] = useState(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:8080/users/user-id", { withCredentials: true })
      .then(res => setUserId(res.data))
      .catch(err => {
        console.error("❌ 유저 정보 로딩 실패", err);
      });
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!question.trim()) return;
    if (!userId) {
      setChatHistory(prev => [...prev, { role: "bot", text: "❗ 로그인한 유저만 질문할 수 있습니다." }]);
      return;
    }

    const userText = question;
    setQuestion("");
    autoResize();
    setChatHistory(prev => [
      ...prev,
      { role: "user", text: userText },
      { role: "bot", text: "💬 생각 중...", loading: true }
    ]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat/chat", {
        user_id: userId,
        question: userText,
      });

      setChatHistory(prev => {
        const updated = prev.filter(msg => !msg.loading);
        return [...updated, { role: "bot", text: res.data.answer }];
      });
    } catch (err) {
      setChatHistory(prev => {
        const updated = prev.filter(msg => !msg.loading);
        return [...updated, {
          role: "bot",
          text: `⚠️ 서버 오류: ${err.response?.data?.detail || err.message}`
        }];
      });
    } finally {
      setLoading(false);
    }
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  };

  return (
    <>
      <NavBar />
      <div className="chat-container">
        <div className="chat-header">
          <Link to="/" className="logo">
            🍽 <span>FoodyChat</span>
          </Link>
        </div>

        <div className="chat-window" ref={chatRef}>
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.role}`}>
              {msg.role === 'bot'
                ? msg.text.split('---').map((block, bIdx) => (
                    <div key={bIdx} className="chat-block">
                      {bIdx !== 0 && <hr className="chat-divider" />}
                      <div>{block.trim()}</div>
                    </div>
                  ))
                : msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input-box">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              autoResize();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="메시지를 입력하세요"
            rows="1"
            className="chat-textarea"
          />
          <button className="chat-send-btn" onClick={handleSend} disabled={loading}>
            {loading ? "전송 중..." : "보내기"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatBot;
