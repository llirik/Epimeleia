
import React from 'react';
import useTime from '../hooks/useTime';

const Clock: React.FC = () => {
  const time = useTime();
  
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight text-white/90">
      {formattedTime}
    </div>
  );
};

export default Clock;
