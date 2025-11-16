export interface AppEvent {
  id: string;
  title: string;
  source: 'gmail' | 'calendar';
  date: string; // ISO 8601 format
  description: string;
  priority: 'high' | 'normal';
}

export type BriefingDay = 'Sunday' | 'Monday';
export type BriefingPriority = 'all' | 'important';
export type VoiceAccent = 'American' | 'British';
export type BriefingFrequency = 'weekly' | 'daily' | 'two-three-days';

export interface Settings {
  briefingDay: BriefingDay;
  briefingPriority: BriefingPriority;
  syncCalendar: boolean;
  syncGmail: boolean;
  voiceAccent: VoiceAccent;
  briefingFrequency: BriefingFrequency;
  userName: string;
  customSalutation: string;
}