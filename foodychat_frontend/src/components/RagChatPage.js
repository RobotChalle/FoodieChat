import React, { useEffect, useState } from "react";
import axios from "axios";

const RagChatPage = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [bmiHistory, setBmiHistory] = useState([]);
  const [foodHistory, setFoodHistory] = useState([]);
  const [response, setResponse] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await axios.get(`/users/${userId}/rag-info`);
        const bmiRes = await axios.get(`/users/${userId}/bmi-history`);
        const foodRes = await axios.get(`/users/${userId}/food-history`);

        setUser(userRes.data);
        setBmiHistory(bmiRes.data);
        setFoodHistory(foodRes.data);
      } catch (error) {
        console.error("데이터 로딩 에러:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSendToFastAPI = async () => {
    try {
      const result = await axios.post("http://localhost:8000/chat/chat", {
        user,
        bmiHistory,
        foodHistory,
      });

      setResponse(result.data.response); // 응답 처리
    } catch (error) {
      console.error("FastAPI 호출 실패:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">개인화 챗봇 RAG 테스트</h1>
      <button
        onClick={handleSendToFastAPI}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        챗봇에게 전송
      </button>

      <div className="mt-6 bg-gray-100 p-4 rounded">
        <h2 className="font-semibold">응답:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default RagChatPage;
