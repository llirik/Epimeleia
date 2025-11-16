import React from 'react';
import type { AppEvent } from '../types';
import { CalendarIcon, MailIcon, LinkIcon } from './icons';

interface EventItemProps {
  event: AppEvent;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const eventDate = new Date(event.date);
  const now = new Date();
  
  const isPast = eventDate < now;
  const hasMeetingLink = /https:\/\/(zoom.us|teams.microsoft.com)/.test(event.description);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <li className={`flex items-start space-x-4 p-3 rounded-lg transition-colors ${isPast ? 'opacity-50' : 'bg-white/5 hover:bg-white/10'}`}>
      <div className="flex-shrink-0 pt-1">
        {event.source === 'calendar' ? <CalendarIcon className="w-5 h-5 text-[#6B7358]" /> : <MailIcon className="w-5 h-5 text-[#6B7358]" />}
      </div>
      <div className="flex-grow text-left">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-[#F4EFE3]">{event.title}</p>
          <div className="text-right text-sm whitespace-nowrap text-[#F4EFE3]/70 ml-4">
            <div>{formatDate(eventDate)}</div>
            <div>{formatTime(eventDate)}</div>
          </div>
        </div>
        <p className="text-sm text-[#F4EFE3]/60 mt-1">{event.description}</p>
        {hasMeetingLink && (
            <div className="mt-2 flex items-center space-x-1 text-xs text-[#829ABF] font-semibold">
                <LinkIcon className="w-3 h-3"/>
                <span>Meeting Link Detected</span>
            </div>
        )}
      </div>
    </li>
  );
};


interface EventsListProps {
  events: AppEvent[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 w-full h-[60vh] max-h-[600px] flex flex-col">
      <h2 className="text-xl font-bold text-[#F4EFE3]/90 mb-4 text-left">Your Agenda</h2>
      {events.length > 0 ? (
        <ul className="space-y-2 overflow-y-auto pr-2 flex-grow">
          {events.map(event => <EventItem key={event.id} event={event} />)}
        </ul>
      ) : (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-[#F4EFE3]/50">No events scheduled.</p>
        </div>
      )}
    </div>
  );
};

export default EventsList;