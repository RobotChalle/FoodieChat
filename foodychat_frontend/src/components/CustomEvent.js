import React from 'react';

const CustomEvent = ({ event }) => {
  return (
    <div style={{
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      fontSize: '0.8rem',
      lineHeight: '1.2',
    }}>
      {event.title}
    </div>
  );
};

export default CustomEvent;