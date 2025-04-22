// src/components/Carousel.jsx

import React from 'react';
import Slider from 'react-slick';
import carouselData from './CarouselData';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './css/carousel.css';

export default function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,           // ✅ 좀 부드럽게
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {carouselData.map(item => (
          <div className="carousel-slide" key={item.id}>
            <img src={item.image} alt={item.title} />
            <div className="carousel-overlay">
              <div className="carousel-caption animate-text">
                <h3>{item.title}</h3>
                <p>{item.sub}</p>
              </div>
              <div
                className="carousel-description animate-text"
                style={item.descriptionStyle}
              >
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
