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
  const foodName = 'bibimbap';

  // 이미지 업로드 시 미리보기 + 분석 요청
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);

      // 서버에 분석 요청
      const payload = new URLSearchParams({
        foodName: foodName
      });

      try {
        setLoading(true);
        const payload = new URLSearchParams({
          foodName: foodName
        });

        const response = await axios.post('http://localhost:8080/analyze/food', payload, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            withCredentials: true
        });

        if (response.status === 200) {
          alert('정보가 성공적으로 저장되었습니다.');
        }
        console.log("return:"+JSON.stringify(response.data));
        //setAnalysisResult(response);
      } catch (error) {
        console.error('분석 요청 실패:', error);
      } finally {
        setLoading(false);
      }
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
                🍽️ 예측 결과:{' '}
                {analysisResult?.predictedClass || '분석 전'}
              </div>
              <div className="confidence-score">
                신뢰도:{' '}
                {analysisResult
                  ? `${(analysisResult.confidence * 100).toFixed(2)}%`
                  : '--%'}
              </div>

              <ul className="top-k-predictions">
                {analysisResult?.topK?.map((item, idx) => (
                  <li key={idx}>
                    {item.className} -{' '}
                    {(item.probability * 100).toFixed(2)}%
                  </li>
                )) || <li>결과 대기 중...</li>}

                {/* 🍱 영양정보 */}
                {analysisResult && (
                  <>
                    <div className="predicted-class">🥗영양정보 </div>
                    <div className="predicted-class">
                      🍱 칼로리 : {analysisResult.calories} kcal
                    </div>
                    <div className="predicted-class">
                      🍔 탄수화물 : {analysisResult.carbohydrates} g
                    </div>
                    <div className="predicted-class">
                      🍖 단백질 : {analysisResult.protein} g
                    </div>
                    <div className="predicted-class">
                      🍰 지방 : {analysisResult.fat} g
                    </div>
                  </>
                )}
              </ul>
            </div>
          )}
          <div className="button-group">
          <button onClick={() => navigate(`/cafe-recommend/${foodName}`, {state: { foodName: foodName }})} className="button secondary">식당 추천</button>
          <button onClick={() => navigate('/meal-recommend')} className="button secondary">식단 추천</button>
          </div>
        </div>
      </div>
    </>
  );
}
