import React from 'react';
import { SparklesIcon, WarningIcon, BullhornIcon } from './icons';

interface WeeklyBriefingProps {
  briefing: string;
  isLoading: boolean;
  error: string;
}

const WeeklyBriefing: React.FC<WeeklyBriefingProps> = ({ briefing, isLoading, error }) => {
  
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 w-full h-[60vh] max-h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#F4EFE3]/90 text-left">Care Briefing</h2>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 text-left bg-black/10 rounded-lg p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F4EFE3]/80"></div>
          </div>
        )}
        {error && (
            <div className="text-[#F4EFE3] flex flex-col items-center justify-center h-full text-center">
                <WarningIcon className="w-10 h-10 mb-2 text-[#5A443D]"/>
                <p className="font-semibold">An Error Occurred</p>
                <p className="text-sm text-[#F4EFE3]/70">{error}</p>
            </div>
        )}
        {!isLoading && !error && briefing && (
          <div className="whitespace-pre-wrap text-[#F4EFE3]/90 leading-relaxed">
            {briefing}
          </div>
        )}
        {!isLoading && !error && !briefing && (
          <div className="flex flex-col items-center justify-center h-full text-[#F4EFE3]/50 text-center">
            <BullhornIcon className="w-12 h-12 mb-2"/>
            <p>Select a briefing from the icon above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyBriefing;