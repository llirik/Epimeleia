import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getMockEvents } from './services/eventService';
import { generateWeeklyBriefing, generateSpeech } from './services/geminiService';
import type { AppEvent, Settings, BriefingFrequency } from './types';
import { decode, decodeAudioData } from './helpers/audioUtils';
import Clock from './components/Clock';
import Greeting from './components/Greeting';
import DatePanel from './components/DatePanel';
import EventsList from './components/EventsList';
import WeeklyBriefing from './components/WeeklyBriefing';
import SettingsPanel from './components/SettingsPanel';
import { SettingsIcon, BullhornIcon, StopIcon } from './components/icons';

const App: React.FC = () => {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [settings, setSettings] = useState<Settings>({
    briefingDay: 'Sunday',
    briefingPriority: 'important',
    syncCalendar: true,
    syncGmail: true,
    voiceAccent: 'American',
    briefingFrequency: 'weekly',
    userName: 'Katja',
    customSalutation: '',
  });
  const [briefing, setBriefing] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isRadioMenuOpen, setIsRadioMenuOpen] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const radioMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const mockEvents = await getMockEvents();
      setEvents(mockEvents);
    };
    fetchEvents();
  }, []);

  // Close radio menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (radioMenuRef.current && !radioMenuRef.current.contains(event.target as Node)) {
        setIsRadioMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const stopPlayback = useCallback(() => {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      }
      setIsPlaying(false);
  }, []);

  const handleRadioBriefing = useCallback(async (frequency: BriefingFrequency) => {
    stopPlayback();
    setIsRadioMenuOpen(false);
    setIsLoading(true);
    setError('');
    setBriefing('');

    try {
      // 1. Generate Text Briefing
      const tempSettings = { ...settings, briefingFrequency: frequency };
      const relevantEvents = events.filter(e => {
        if (tempSettings.briefingPriority === 'all') return true;
        return e.priority === 'high';
      });
      const textBriefing = await generateWeeklyBriefing(relevantEvents, tempSettings);
      setBriefing(textBriefing);
      
      if (!textBriefing) {
        throw new Error("Briefing text could not be generated.");
      }

      // 2. Generate Speech
      const audioDataB64 = await generateSpeech(textBriefing, settings.voiceAccent);
      const audioCtx = audioContextRef.current;
      if (!audioCtx) throw new Error("Audio context not available.");

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      
      // 3. Decode and Play Audio
      const rawAudio = decode(audioDataB64);
      const audioBuffer = await decodeAudioData(rawAudio, audioCtx, 24000, 1);
      
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.onended = () => {
          setIsPlaying(false);
          audioSourceRef.current = null;
      };
      source.start();
      audioSourceRef.current = source;
      setIsPlaying(true);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during briefing generation.');
    } finally {
      setIsLoading(false);
    }
  }, [events, settings, stopPlayback]);

  const toggleRadioMenu = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      setIsRadioMenuOpen(prev => !prev);
    }
  };
  
  const backgroundImageUrl = useMemo(() => 'https://picsum.photos/1920/1080?grayscale&blur=2', []);

  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center text-[#F4EFE3] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 transition-all duration-500"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-[#2C4A47]/80 bg-blend-multiply z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
        <main className="flex flex-col items-center space-y-4 max-w-5xl w-full">
          <Greeting name={settings.userName} />
          <Clock />
          <DatePanel />

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
            <EventsList events={events} />
            <WeeklyBriefing 
              briefing={briefing}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2" ref={radioMenuRef}>
        <div className="relative">
          <button
            onClick={toggleRadioMenu}
            disabled={isLoading}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-wait"
            aria-label={isPlaying ? "Stop briefing" : "Start care briefing"}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F4EFE3]"></div>
            ) : isPlaying ? (
              <StopIcon className="w-6 h-6 text-[#F4EFE3]" />
            ) : (
              <BullhornIcon className="w-6 h-6 text-[#F4EFE3]" />
            )}
          </button>
          {isRadioMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#203735]/90 backdrop-blur-lg rounded-lg shadow-xl py-1">
              <button onClick={() => handleRadioBriefing('daily')} className="w-full text-left px-4 py-2 text-sm text-[#F4EFE3]/90 hover:bg-[#5A443D] transition-colors">Today's Briefing</button>
              <button onClick={() => handleRadioBriefing('two-three-days')} className="w-full text-left px-4 py-2 text-sm text-[#F4EFE3]/90 hover:bg-[#5A443D] transition-colors">Next 3 Days</button>
              <button onClick={() => handleRadioBriefing('weekly')} className="w-full text-left px-4 py-2 text-sm text-[#F4EFE3]/90 hover:bg-[#5A443D] transition-colors">This Week</button>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Open Settings"
        >
          <SettingsIcon className="w-6 h-6 text-[#F4EFE3]" />
        </button>
      </div>


      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
      
      <footer className="absolute bottom-4 text-[#F4EFE3]/50 text-sm z-10">
        Epimeleia - voice-guided compass for gentle productivity meaningful progress
      </footer>
    </div>
  );
};

export default App;