import React from 'react';
import useTime from '../hooks/useTime';

const DateDisplay: React.FC = () => {
  const time = useTime();
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(time);

  return (
    <div className="text-xl sm:text-2xl md:text-3xl font-medium tracking-wide text-white/80">
      {formattedDate}
    </div>
  );
};

export default DateDisplay;