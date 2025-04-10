// src/components/Carousel.jsx

import React, { useState } from 'react';
import carouselData from './CarouselData';
import './css/carousel.css';

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const currentSlide = carouselData[current];
  const length = carouselData.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + length) % length);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-title"></div>

      <button className="left-arrow" onClick={prevSlide}>&lt;</button>

      <div className="carousel-slide">
        <img src={currentSlide.image} alt={`slide-${current}`} />
        <div
          className="carousel-caption"
          style={currentSlide.captionStyle}
        >
          <h3>{currentSlide.title}</h3>
          <p>{currentSlide.sub}</p>
        </div>
      </div>

      <div
        className="carousel-description"
        style={currentSlide.descriptionStyle} // ✅ 글자 색상만 적용
      >
        {currentSlide.description}
      </div>

      <button className="right-arrow" onClick={nextSlide}>&gt;</button>
    </div>
  );
}
