# 🍽 FoodyChat - AI 기반 음식 분석 & 맞춤 추천 서비스

![적절한 이미지 커버 설정 FoodieyChat Cover](https://github.com/user-attachments/assets/your_image_url_here)


## 📌 사이트
- 배포 URL : 추가
  
### 🔑 로그인 정보
- Test ID : 어드민으로 할듯
- Test PW : 

## 📖 프로젝트 소개

- **FoodieyChat**은 **AI 기반 음식 이미지 분석 및 맞춤 식단 추천**을 제공하는 웹 서비스입니다.  
- 사용자가 음식 사진을 업로드하면 **CNN 모델이 음식 이름과 칼로리를 자동 분석**하고, 이를 **회원 데이터베이스에 기록**하여 **챗봇을 통한 식단 추천 및 건강 관리**를 지원합니다.  
- Google OAuth를 통한 **간편 회원가입**을 지원하며, **RAG 기반 LLM**을 활용한 AI 식단 상담 기능을 제공합니다.

---

## 🏆 주요 기능

✅ **음식 이미지 분석 (CNN 적용)**  
✅ **음식 칼로리 및 영양 정보 제공**  
✅ **회원별 식단 기록 및 건강 목표 설정 (체중 감량, 건강 유지 등)**  
✅ **챗봇을 통한 맞춤 식단 추천 (RAG 기반 LLM 적용)**  
✅ **Google 계정 연동 로그인 지원**  
✅ **Gradio를 활용한 데이터 시각화 대시보드 제공**  

---

## 👥 팀원 구성

<div align="center">

| **이정우** | **박정선** | **이윤주** | **최주철** | **박지훈** |
| :------: |  :------: | :------: | :------: | :------: |
| ![user_1_image](https://github.com/user-attachments/assets/sample_image_2)|![user_2_image](https://github.com/user-attachments/assets/sample_image_2)|![user_3_image](https://github.com/user-attachments/assets/sample_image_3) |![user_4_image](https://github.com/user-attachments/assets/sample_image_4) |![user_5_image](https://github.com/user-attachments/assets/sample_image_5) |

</div>
<br>

---

## 🔧 개발 환경

### **🖥️ 프론트엔드**
| 기술 스택 | 설명 |
|-----------|-------------|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) | 웹 페이지 구조 정의 |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) | 웹 스타일링 적용 |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white) | 동적 기능 및 클라이언트 측 로직 구현 |
| ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white) | DOM 조작 및 Ajax 요청 처리 |
| ![JSP](https://img.shields.io/badge/JSP-007396?style=for-the-badge&logo=java&logoColor=white) | 동적 웹 페이지 생성 |

---

### **🖥️ 백엔드**
| 기술 스택 | 설명 |
|-----------|-------------|
| ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) | 웹 애플리케이션 프레임워크 (**버전: 3.0 이상**) |
| ![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) | 비즈니스 로직 구현 (**JDK 17**) |
| ![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white) | Groovy 기반 빌드 도구 (**버전: 8.11.1**) |
| ![MyBatis](https://img.shields.io/badge/MyBatis-FF6F00?style=for-the-badge&logo=apache&logoColor=white) | 데이터베이스 연동 및 쿼리 처리 (**버전: 3.5.9**) |

---

### **🖥️ AI & LLM**
| 기술 스택 | 설명 |
|-----------|-------------|
| ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) | 머신러닝 및 딥러닝 예측 모델 구현 (**버전: 3.10.6**) |
| ![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white) | 음식 이미지 분석 CNN 모델 |
| ![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ai&logoColor=white) | 대규모 언어 모델을 통한 AI 서비스 |
| ![RAG 기반 LLM](https://img.shields.io/badge/RAG-4A90E2?style=for-the-badge&logo=ai&logoColor=white) | 문서 검색 + LLM 조합을 통한 AI 식단 추천 |

---

### **🖥️ 데이터베이스 & API**
| 기술 스택 | 설명 |
|-----------|-------------|
| ![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white) | 데이터 저장소 (RDBMS, **버전: 10.6**) |
| ![REST API](https://img.shields.io/badge/REST%20API-0052CC?style=for-the-badge&logo=api&logoColor=white) | FAST API를 활용한 데이터 통신 |
| ![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white) | Google 계정 연동 로그인 |

---

### **🖥️ 배포 & DevOps**
| 기술 스택 | 설명 |
|-----------|-------------|
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) | 컨테이너 기반 배포 |
| ![Google Cloud](https://img.shields.io/badge/Google%20Cloud-4285F4?style=for-the-badge&logo=google-cloud-platform&logoColor=white) | Google Cloud 기반 배포 |
| ![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white) | 서버 운영 환경 |
| ![CI/CD](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white) | 자동화 배포 & 테스트 |

---

## 📌 향후 개선 방향

🔹 **음식 추천 알고리즘 개선** → 단순 칼로리 계산을 넘어 **영양소 기반 추천 시스템** 도입  
🔹 **운동 & 건강 기록 기능 추가** → 사용자 맞춤형 건강 관리 플랫폼으로 확장  
🔹 **모바일 앱 개발** → React Native를 활용한 iOS/Android 앱 지원  

---

## 📢 **문의 및 기여**
- 해당 프로젝트는 지속적으로 업데이트됩니다.  
- 기여를 원하시면 **Issues** 및 **Pull Requests**를 통해 의견을 남겨주세요!  

✉️ **Contact:** foodieychat@support.com  
📌 **GitHub Repository:** [https://github.com/FoodieyChat](https://github.com/FoodieyChat)  

---

🚀 **"AI와 함께하는 건강한 식생활, FoodieyChat에서 시작하세요!"** 🚀
