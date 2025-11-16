import React, { useMemo } from 'react';
import useTime from '../hooks/useTime';

interface GreetingProps {
  name: string;
}

const Greeting: React.FC<GreetingProps> = ({ name }) => {
  const time = useTime();

  const greetingText = useMemo(() => {
    const hour = time.getHours();
    const salutation = name ? `, ${name}` : '';
    if (hour < 12) {
      return `Good morning${salutation}.`;
    } else if (hour < 17) {
      return `Good afternoon${salutation}.`;
    } else {
      return `Good evening${salutation}.`;
    }
  }, [time, name]);

  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white/80">
      {greetingText}
    </h1>
  );
};

export default Greeting;