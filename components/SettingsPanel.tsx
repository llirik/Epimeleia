import React from 'react';
import type { Settings, BriefingDay, BriefingPriority, VoiceAccent, BriefingFrequency } from '../types';
import { CloseIcon } from './icons';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  const handleSettingChange = <K extends keyof Settings,>(key: K, value: Settings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };
  
  const RadioButton = <T extends string,>({ name, value, label, checked, onChange }: { name: string, value: T, label: string, checked: boolean, onChange: (value: T) => void}) => (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input 
        type="radio" 
        name={name}
        value={value}
        checked={checked} 
        onChange={() => onChange(value)}
        className="hidden"
      />
      <span className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${checked ? 'bg-[#5A443D] text-[#F4EFE3]' : 'bg-[#6B7358]/40 hover:bg-[#6B7358]/60 text-[#F4EFE3]/80'}`}>
        {label}
      </span>
    </label>
  );

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
    >
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#203735]/90 backdrop-blur-lg text-[#F4EFE3] shadow-2xl z-50 p-6 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8 overflow-y-auto h-[calc(100%-4rem)] pr-2">
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Personalization</h3>
            <div className="space-y-4 bg-black/10 p-4 rounded-lg">
                <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-[#F4EFE3]/70 mb-2">Your Name</label>
                    <input
                        id="userName"
                        type="text"
                        value={settings.userName}
                        onChange={e => handleSettingChange('userName', e.target.value)}
                        placeholder="e.g., Alex"
                        className="w-full bg-white/5 rounded-md border-0 px-3 py-2 text-[#F4EFE3] ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-[#5A443D]"
                    />
                </div>
                <div>
                    <label htmlFor="customSalutation" className="block text-sm font-medium text-[#F4EFE3]/70 mb-2">Briefing Salutation</label>
                    <input
                        id="customSalutation"
                        type="text"
                        value={settings.customSalutation}
                        onChange={e => handleSettingChange('customSalutation', e.target.value)}
                        placeholder="e.g., Captain, friend"
                        className="w-full bg-white/5 rounded-md border-0 px-3 py-2 text-[#F4EFE3] ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-[#5A443D]"
                    />
                    <p className="text-xs text-[#F4EFE3]/50 mt-1">Used by the AI to address you in the audio briefing.</p>
                </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Care Briefing</h3>
            <div className="space-y-4 bg-black/10 p-4 rounded-lg">
               <div>
                <label className="block text-sm font-medium text-[#F4EFE3]/70 mb-2">Briefing Frequency</label>
                <div className="flex space-x-2 flex-wrap gap-y-2">
                    <RadioButton name="briefingFrequency" value="daily" label="Daily" checked={settings.briefingFrequency === 'daily'} onChange={(v: BriefingFrequency) => handleSettingChange('briefingFrequency', v)} />
                    <RadioButton name="briefingFrequency" value="two-three-days" label="Next 3 Days" checked={settings.briefingFrequency === 'two-three-days'} onChange={(v: BriefingFrequency) => handleSettingChange('briefingFrequency', v)} />
                    <RadioButton name="briefingFrequency" value="weekly" label="Weekly" checked={settings.briefingFrequency === 'weekly'} onChange={(v: BriefingFrequency) => handleSettingChange('briefingFrequency', v)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#F4EFE3]/70 mb-2">Briefing Day (for weekly)</label>
                <div className="flex space-x-2">
                    <RadioButton name="briefingDay" value="Sunday" label="Sunday" checked={settings.briefingDay === 'Sunday'} onChange={(v: BriefingDay) => handleSettingChange('briefingDay', v)} />
                    <RadioButton name="briefingDay" value="Monday" label="Monday" checked={settings.briefingDay === 'Monday'} onChange={(v: BriefingDay) => handleSettingChange('briefingDay', v)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#F4EFE3]/70 mb-2">Briefing Priority</label>
                 <div className="flex space-x-2">
                    <RadioButton name="briefingPriority" value="important" label="Important Only" checked={settings.briefingPriority === 'important'} onChange={(v: BriefingPriority) => handleSettingChange('briefingPriority', v)} />
                    <RadioButton name="briefingPriority" value="all" label="All Events" checked={settings.briefingPriority === 'all'} onChange={(v: BriefingPriority) => handleSettingChange('briefingPriority', v)} />
                </div>
              </div>
               <div>
                <label className="block text-sm font-medium text-[#F4EFE3]/70 mb-2">Voice Accent</label>
                 <div className="flex space-x-2">
                    <RadioButton name="voiceAccent" value="American" label="American" checked={settings.voiceAccent === 'American'} onChange={(v: VoiceAccent) => handleSettingChange('voiceAccent', v)} />
                    <RadioButton name="voiceAccent" value="British" label="British" checked={settings.voiceAccent === 'British'} onChange={(v: VoiceAccent) => handleSettingChange('voiceAccent', v)} />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Data Sources</h3>
            <div className="space-y-3 bg-black/10 p-4 rounded-lg">
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="font-medium">Sync Google Calendar</span>
                <input type="checkbox" className="sr-only peer" checked={settings.syncCalendar} onChange={e => handleSettingChange('syncCalendar', e.target.checked)} />
                <div className="relative w-11 h-6 bg-[#6B7358]/70 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#A98E7B] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5A443D]"></div>
              </label>
              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="font-medium">Sync Gmail</span>
                <input type="checkbox" className="sr-only peer" checked={settings.syncGmail} onChange={e => handleSettingChange('syncGmail', e.target.checked)} />
                <div className="relative w-11 h-6 bg-[#6B7358]/70 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#A98E7B] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5A443D]"></div>
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;