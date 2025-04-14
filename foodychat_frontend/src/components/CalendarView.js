import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function CalendarView({ meals }) {
  const events = meals.map(meal => ({
    title: `${meal.meal_type_nm}: ${meal.meal_text}`,
    start: new Date(meal.meal_date),
    end: new Date(meal.meal_date),
    allDay: true,
  }));

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  );
}
