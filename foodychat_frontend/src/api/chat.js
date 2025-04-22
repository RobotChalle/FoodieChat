// src/api/chat.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_FAST_API_URL;

export const sendChatMessage = async (userId, message) => {
  try {
    const response = await axios.post(`${BASE_URL}/chat/chat`, {
      user_id: userId,
      question: message,
    });
    return response.data.answer;
  } catch (error) {
    console.error("Chat API error:", error);
    throw error;
  }
};
