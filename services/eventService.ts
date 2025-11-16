
import type { AppEvent } from '../types';

export const getMockEvents = (): Promise<AppEvent[]> => {
  const now = new Date();
  
  const createEventDate = (days: number, hours: number, minutes: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  }

  const mockEvents: AppEvent[] = [
    {
      id: 'cal-1',
      title: 'Project Phoenix Sync',
      source: 'calendar',
      date: createEventDate(1, 9, 0),
      description: 'Weekly sync meeting. Agenda is in the shared doc. Join here: https://zoom.us/j/1234567890',
      priority: 'high',
    },
    {
      id: 'gmail-1',
      title: 'Re: Design Mockups for Q3',
      source: 'gmail',
      date: createEventDate(1, 15, 0),
      description: 'Email from Jane Doe. Deadline: Please provide feedback by tomorrow EOD.',
      priority: 'high',
    },
    {
      id: 'cal-5',
      title: 'Global All-Hands',
      source: 'calendar',
      date: createEventDate(2, 17, 0),
      description: 'Company-wide meeting scheduled for 8:00 AM PST. Please join on time.',
      priority: 'normal',
    },
    {
      id: 'cal-2',
      title: 'Dentist Appointment',
      source: 'calendar',
      date: createEventDate(2, 14, 30),
      description: 'Annual check-up.',
      priority: 'normal',
    },
    {
      id: 'cal-3',
      title: 'Team Lunch',
      source: 'calendar',
      date: createEventDate(3, 12, 0),
      description: 'Celebrating project launch at The Golden Spoon.',
      priority: 'normal',
    },
    {
      id: 'gmail-2',
      title: 'Your flight to SFO is confirmed',
      source: 'gmail',
      date: createEventDate(4, 18, 45),
      description: 'Flight UA 456 departing from JFK.',
      priority: 'normal',
    },
    {
      id: 'cal-4',
      title: 'Marketing Strategy Review',
      source: 'calendar',
      date: createEventDate(5, 11, 0),
      description: 'Final review before presentation. Meeting link: https://teams.microsoft.com/l/meetup-join/...',
      priority: 'high',
    }
  ];

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }, 500);
  });
};
