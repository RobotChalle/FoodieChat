import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ko'; // ✅ 한글 로케일 추가
moment.locale('ko');       // ✅ 한글로 설정
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './css/calendarview.css';
import CustomEvent from './CustomEvent'; // ✅ 추가

const localizer = momentLocalizer(moment);

export default function CalendarView({ meals }) {
  const events = meals.map(meal => ({
    title: `${meal.meal_type_nm}: ${meal.meal_text}`,
    start: new Date(meal.meal_date),
    end: new Date(meal.meal_date),
    allDay: true,
  }));

  return (
    <div className="calendar-scroll-wrapper">
      <div className="calendar-fixed-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', width: '100%' }}
          components={{ event: CustomEvent }} // ✅ 이벤트 커스터마이징
        />
      </div>
    </div>
  );
}
