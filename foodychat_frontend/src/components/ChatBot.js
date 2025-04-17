import { useEffect, useState } from "react";
import axios from "axios";

function ChatBot() {
  const [userId, setUserId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/users/user-id", { withCredentials: true })
      .then(res => setUserId(res.data))
      .catch(err => {
        console.error("❌ 유저 정보 로딩 실패", err);
      });
  }, []);

  const handleSend = async () => {
    if (!question.trim()) return;
    if (!userId) {
      setAnswer("❗ 로그인한 유저만 질문할 수 있습니다.");
      return;
    }

    setLoading(true);
    setAnswer(""); // 로딩 중 이전 응답 초기화
    try {
      const res = await axios.post("http://localhost:8000/chat/chat", {
        user_id: userId,
        question,
      });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer(`⚠️ 서버 오류: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🤖 Gemini 챗봇</h1>

      {!userId ? (
        <p style={styles.status}>🔐 로그인 유저 정보를 불러오는 중입니다...</p>
      ) : (
        <>
          <div style={styles.chatBox}>
            {/* 사용자 질문 말풍선 */}
            {question && (
              <div style={{ ...styles.bubble, ...styles.userBubble }}>
                {question}
              </div>
            )}

            {/* 챗봇 응답 말풍선 */}
            {loading ? (
              <div style={{ ...styles.bubble, ...styles.botBubble }}>
                <span className="blinking">💬 생각 중...</span>
              </div>
            ) : (
              answer && (
                <div style={{ ...styles.bubble, ...styles.botBubble }}>
                  <pre style={styles.pre}>{answer}</pre>
                </div>
              )
            )}
          </div>

          <div style={styles.inputArea}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="질문을 입력하세요"
              rows="4"
              style={styles.textarea}
            />
            <button onClick={handleSend} disabled={loading} style={styles.button}>
              {loading ? "전송 중..." : "질문 보내기"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "Segoe UI, sans-serif",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  header: {
    fontSize: "2rem",
    marginBottom: "1rem",
    textAlign: "center",
    color: "#333",
  },
  status: {
    fontStyle: "italic",
    color: "#666",
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    minHeight: "200px",
  },
  bubble: {
    padding: "0.75rem 1rem",
    borderRadius: "16px",
    maxWidth: "100%", // ✅ 전체 컨테이너 기준 최대
    wordBreak: "break-word", // ✅ 단어 분할 허용
    overflowWrap: "break-word", // ✅ 줄바꿈
    whiteSpace: "pre-wrap", // ✅ 개행 유지 + 자동 줄바꿈
    lineHeight: "1.6",
  },
  userBubble: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
  },
  inputArea: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  textarea: {
    width: "100%",
    padding: "1rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "none",
  },
  button: {
    alignSelf: "flex-end",
    backgroundColor: "#4F46E5",
    color: "#fff",
    padding: "0.75rem 1.25rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  pre: {
    margin: 0,
    fontFamily: "inherit",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
  },
};

export default ChatBot;
