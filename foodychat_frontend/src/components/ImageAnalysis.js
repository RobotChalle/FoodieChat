import React, { useState, useRef } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './css/main.css';
import './css/image-analysis.css';

export default function Imageanalysis() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const imageInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${BASE_URL}/analyze/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      console.log("🍽 결과:", response.data);
      setAnalysisResult(response.data);
    } catch (error) {
      // 로그인 필요에 따른 401 처리
      if (error.response?.status === 401) {
        setPreviewUrl(null);
        setSelectedImage(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
        toast.info(error.response.data || '로그인이 필요합니다.');
      } else {
        toast.error('분석 실패');
      }
      console.error('❌ 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendation = () => {
    if (analysisResult?.predictedClass) {
      navigate(`/cafe-recommend/${analysisResult.predictedClass}`);
    } else {
      if (window.confirm("예측된 음식이 없습니다. 전체 식당 목록을 보시겠습니까?")) {
        navigate('/cafe-recommend/all');
      } else {
        toast.info("분석 후 추천을 이용해보세요.");
      }
    }
  };

  return (
    <>
      <NavBar />
      <div className="analysis-wrapper">
        <div className="analysis-inner">
          <h1 className="analysis-title">이미지 분석</h1>

          {/* 이미지 업로드 영역 */}
          <div
            className="upload-area"
            onClick={() => imageInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) {
                imageInputRef.current.files = e.dataTransfer.files;
                handleImageChange({ target: { files: e.dataTransfer.files } });
              }
            }}
          >
            <p>이미지를 클릭하거나 드래그 앤 드롭하세요</p>
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* 🖼️ 이미지 미리보기 */}
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="업로드된 음식" />
            </div>
          )}

          {/* 분석 중 메시지 */}
          {loading && <p className="loading-message">🔍 분석 중입니다...</p>}

          {analysisResult && (
            <>
              <div className="result-card">
                <div className="predicted-class">
                  🍽️ 예측 결과: <strong>{analysisResult.food_ko_name}</strong>
                </div>
                <div className="confidence-score">
                  신뢰도: {(analysisResult.confidence * 100).toFixed(2)}%
                </div>
              </div>

              {/* ✅ 영양정보 카드 */}
              <div className="nutrition-card">
                <h3>🥗 영양 정보</h3>
                <ul className="nutrition-list">
                  <li><strong>칼로리:</strong> {analysisResult.calories} kcal</li>
                  <li><strong>탄수화물:</strong> {analysisResult.nut_carb} g</li>
                  <li><strong>단백질:</strong> {analysisResult.nut_pro} g</li>
                  <li><strong>지방:</strong> {analysisResult.nut_fat} g</li>
                </ul>
              </div>
            </>
          )}

          {/* 추천 버튼 */}
          <div className="button-group">
            <button
              onClick={handleRecommendation}
              className="button secondary btn"
            >
              식당 추천
            </button>
            <button
              onClick={() => navigate('/meal-recommend')}
              className="button secondary btn"
            >
              식단 추천
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
