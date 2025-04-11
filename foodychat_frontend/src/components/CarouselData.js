// src/components/CarouselData.js

const carouselData = [
  {
    id: 1,
    image: require('./img/img11.png'),
    title: '1. 이미지를 찍어서 업로드하세요',
    sub: 'FoodyChat이 음식 사진을 인식해줍니다.',
    description: '음식 사진을 스마트폰으로 촬영한 후 업로드하면, 영양 정보를 AI가 분석해줍니다.',
    descriptionStyle: {
      color: '#5C5C5C' // 파스텔 옐로우 (1번 슬라이드는 그대로)
    }
  },
  {
    id: 2,
    image: require('./img/img22.png'),
    title: '2. 자동으로 음식 정보를 받아보세요',
    sub: 'AI가 음식의 칼로리, 영양성분을 분석합니다.',
    description: '분석된 결과는 바로 화면에 시각적으로 표시됩니다. 직접 입력할 필요가 없습니다!',
    descriptionStyle: {
      color: '#5C5C5C' // ✅ 여기만 검정색으로 수정됨
    }
  }
];

export default carouselData;
