
import React from 'react';
import { SalesBrief, UrgencyLevel } from '../types';
import { Icons } from '../constants';

interface BriefViewProps {
  brief?: SalesBrief;
  isLoading: boolean;
}

const BriefView: React.FC<BriefViewProps> = ({ brief, isLoading }) => {
  if (!brief && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-brand-sage text-center p-8 opacity-50">
        <Icons.FileText />
        <p className="mt-4 font-serif text-lg">Initiate conversation to generate a sales brief.</p>
      </div>
    );
  }

  const getUrgencyColor = (level?: UrgencyLevel) => {
    switch (level) {
      case UrgencyLevel.CRITICAL: return 'bg-red-100 text-red-700 border-red-200';
      case UrgencyLevel.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
      case UrgencyLevel.MEDIUM: return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`transition-all duration-500 ${isLoading ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
      <div className="bg-white premium-shadow rounded-sm overflow-hidden">
        <div className="bg-brand-forest px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-serif text-xl font-semibold flex items-center gap-2">
            <Icons.FileText /> --- SALES BRIEF ---
          </h2>
          {brief && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getUrgencyColor(brief.urgencyLevel)} uppercase tracking-wider`}>
              {brief.urgencyLevel} Priority
            </span>
          )}
        </div>
        
        <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BriefItem label="Client Name" value={brief?.clientName} />
            <BriefItem label="Project Type" value={brief?.projectType} />
            <BriefItem label="Location" value={brief?.location} />
            <BriefItem label="Budget Range" value={brief?.budgetRange} />
            <BriefItem label="Timeline" value={brief?.timeline} />
            <BriefItem label="Design Style Signals" value={brief?.designStyleSignals} />
          </div>

          <div className="space-y-4 pt-4 border-t border-brand-stone">
            <BriefItem label="Key Goals" value={brief?.keyGoals} fullWidth />
            <BriefItem label="Potential Challenges" value={brief?.potentialChallenges} fullWidth />
            <BriefItem label="Recommended Next Step" value={brief?.recommendedNextStep} fullWidth highlight />
          </div>
        </div>
        
        <div className="bg-brand-stone px-6 py-3 text-[10px] text-brand-sage uppercase tracking-widest text-center">
          Internal Use Only • LBJ Landscape Architecture Intelligence
        </div>
      </div>
    </div>
  );
};

const BriefItem: React.FC<{ label: string; value?: string; fullWidth?: boolean; highlight?: boolean }> = ({ label, value, fullWidth, highlight }) => (
  <div className={`${fullWidth ? 'col-span-full' : ''} group`}>
    <h4 className="text-brand-sage text-[11px] uppercase tracking-wider font-semibold mb-1">{label}</h4>
    <p className={`text-brand-charcoal leading-relaxed ${highlight ? 'font-semibold text-brand-forest italic' : 'font-medium'} transition-colors duration-200 group-hover:text-brand-forest`}>
      {value || <span className="text-brand-stone italic">Awaiting information...</span>}
    </p>
  </div>
);

export default BriefView;
