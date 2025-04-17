import { useEffect, useState } from "react";
import axios from "axios";

function ChatTest() {
  const [userId, setUserId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 세션 기반 유저 ID 불러오기
  useEffect(() => {
    axios.get("http://localhost:8080/users/user-id", { withCredentials: true })
      .then(res => {
        console.log("📦 세션 유저 ID:", res.data);
        setUserId(res.data);
      })
      .catch(err => {
        console.error("❌ 세션 유저 정보를 불러오지 못했습니다.", err.response || err);
      });
  }, []);

  // ✅ 질문 전송
  const handleSend = async () => {
    if (!question.trim()) return;
    if (!userId) {
      setAnswer("❗ 로그인한 유저만 질문할 수 있습니다.");
      return;
    }

    setLoading(true);
    try {
      console.log("📨 전송할 userId:", userId);
      const res = await axios.post("http://localhost:8000/chat/chat", {
        user_id: userId,
        question,
      });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error("❌ FastAPI 에러:", err.response || err);
      setAnswer(`⚠️ 서버 오류: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container" style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>🗨️ Gemini 챗봇</h2>
      {!userId ? (
        <p>🔐 로그인 유저 정보를 불러오는 중입니다...</p>
      ) : (
        <>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="질문을 입력하세요"
            rows="5"
            cols="50"
            style={{ padding: "1rem", fontSize: "1rem" }}
          />
          <br />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", fontSize: "1rem" }}
          >
            {loading ? "질문 전송 중..." : "질문 보내기"}
          </button>
          <div style={{ marginTop: "1.5rem" }}>
            <strong>💬 응답:</strong>
            <div style={{ whiteSpace: "pre-wrap", marginTop: "0.5rem", lineHeight: "1.7" }}>
              {answer}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatTest;
