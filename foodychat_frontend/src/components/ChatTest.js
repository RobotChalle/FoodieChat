import { useEffect, useState } from "react";
import axios from "axios";

function ChatTest() {
  const [userId, setUserId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 세션 기반 유저 ID 불러오기 (Spring Boot 세션에서 user_id만 반환)
  useEffect(() => {
    axios.get("http://localhost:8080/users/user-id", { withCredentials: true })
      .then(res => {
        console.log("📦 세션 유저 ID:", res.data);
        setUserId(res.data);  // 서버에서 문자열로 user_id만 반환한다고 가정
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
    <div className="chat-container">
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
          />
          <br />
          <button onClick={handleSend} disabled={loading}>
            {loading ? "질문 전송 중..." : "질문 보내기"}
          </button>
          <div style={{ marginTop: "1rem" }}>
            <strong>💬 응답:</strong>
            <p>{answer}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatTest;
