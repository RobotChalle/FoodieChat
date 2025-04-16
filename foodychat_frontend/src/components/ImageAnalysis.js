import { useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import './css/main.css';
import './css/image-analysis.css';

export default function Imageanalysis() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 이미지 업로드 시 미리보기 + 분석 요청
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file',file);

      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      setAnalysisResult(response.data);
      console.log("🍽 예측 결과:", response.data);
    } catch (error) {
      console.error('❌ 예측 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="analysis-wrapper">
        <div className="analysis-inner">
          <h1 className="analysis-title">🍕이미지 분석🥤</h1>

          {/* 📤 업로드 버튼 */}
          <label htmlFor="imageUpload" className="upload-button">
            음식 이미지 업로드
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />

          {/* 🖼️ 이미지 미리보기 */}
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="업로드된 음식" />
            </div>
          )}

          {/* 분석 중 메시지 */}
          {loading && <p style={{ color: '#888' }}>🔍 분석 중입니다...</p>}

          {/* 분석 결과 카드 */}
          {selectedImage && (
            <div className="result-card">
              <div className="predicted-class">
                🍽️ 예측 결과: <strong>{analysisResult.predicted_class}</strong>
              </div>
              <div className="confidence-score">
                신뢰도: {(analysisResult.confidence * 100).toFixed(2)}%
              </div>

              {analysisResult.calories && (
                <>
                  <div className="predicted-class">🥗 영양정보</div>
                  <div>🍱 칼로리 : {analysisResult.calories} kcal</div>
                  <div>🍔 탄수화물 : {analysisResult.carbohydrates} g</div>
                  <div>🍖 단백질 : {analysisResult.protein} g</div>
                  <div>🍰 지방 : {analysisResult.fat} g</div>
                </>
              )}
            </div>
          )}
          <div className="button-group">
          <button
              onClick={() => {
                if (analysisResult?.predicted_class) {
                  navigate(`/cafe-recommend/${analysisResult.predicted_class}`);
                }
              }}
              className="button secondary"
              disabled={!analysisResult?.predicted_class}
            >
              식당 추천
            </button>
            <button
              onClick={() => navigate('/meal-recommend')}
              className="button secondary"
            >
              식단 추천
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
