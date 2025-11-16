import React from 'react';
import useTime from '../hooks/useTime';

const DatePanel: React.FC = () => {
  const time = useTime();
  
  const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(time);
  const dayOfMonth = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(time);
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(time);

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl px-6 py-3 sm:px-8 sm:py-4 w-auto text-center flex items-center justify-center space-x-4 sm:space-x-6">
      <p className="text-xl sm:text-2xl text-[#F4EFE3]/80 font-medium tracking-wide capitalize">{dayOfWeek}</p>
      <p className="text-4xl sm:text-5xl font-bold text-[#F4EFE3]">{dayOfMonth}</p>
      <p className="text-xl sm:text-2xl text-[#F4EFE3]/80 font-medium tracking-wide capitalize">{month}</p>
    </div>
  );
};

export default DatePanel;