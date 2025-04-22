import React from 'react';
import './css/tableview.css';

export default function TableView({ meals }) {
  return (
    <div className="pretty-table-wrapper">
      <h2 className="pretty-table-title">🍽️ 식단 요약</h2>
      <div className="pretty-table">
        <div className="pretty-table-header">
          <span>📅 날짜</span>
          <span>🍱 구분</span>
          <span>🥗 식단</span>
        </div>
        {meals.map((meal, idx) => (
          <div key={idx} className="pretty-table-row">
            <span>{meal.meal_date}</span>
            <span>{meal.meal_type_nm}</span>
            <span>{meal.meal_text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
