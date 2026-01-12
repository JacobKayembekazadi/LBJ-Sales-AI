
import React from 'react';
import { ActionDocument } from '../types';
import { Icons } from '../constants';

interface DeliverableViewProps {
  doc: ActionDocument;
}

const DeliverableView: React.FC<DeliverableViewProps> = ({ doc }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white premium-shadow border border-brand-stone rounded-sm p-10 font-sans text-brand-charcoal max-w-4xl mx-auto printable-area">
      <div className="flex justify-between items-start border-b-2 border-brand-forest pb-6 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-forest uppercase tracking-tight">{doc.title}</h1>
          <div className="mt-2 text-brand-sage text-xs uppercase tracking-[0.2em] font-bold">
            Action Document • Confidential
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-brand-sage uppercase font-bold tracking-widest">Prepared For</p>
          <p className="font-serif text-lg font-semibold">{doc.preparedFor}</p>
          <p className="text-[10px] text-brand-sage mt-1">{doc.date}</p>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xs uppercase tracking-[0.3em] font-black text-brand-forest border-l-4 border-brand-gold pl-3 mb-3">Executive Summary</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{doc.executiveSummary}</p>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-[0.3em] font-black text-brand-forest border-l-4 border-brand-gold pl-3 mb-3">Key Insights</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{doc.keyInsights}</p>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-[0.3em] font-black text-brand-forest border-l-4 border-brand-gold pl-3 mb-3 text-brand-forest">Strategic Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-brand-stone/20 p-4 border border-brand-stone/40">
              <h3 className="text-[10px] uppercase font-bold text-brand-sage mb-2">30-Day Plan</h3>
              <p className="text-xs leading-relaxed italic">{doc.plan30Day}</p>
            </div>
            <div className="bg-brand-stone/20 p-4 border border-brand-stone/40">
              <h3 className="text-[10px] uppercase font-bold text-brand-sage mb-2">60-Day Plan</h3>
              <p className="text-xs leading-relaxed italic">{doc.plan60Day}</p>
            </div>
            <div className="bg-brand-stone/20 p-4 border border-brand-stone/40">
              <h3 className="text-[10px] uppercase font-bold text-brand-sage mb-2">90-Day Plan</h3>
              <p className="text-xs leading-relaxed italic">{doc.plan90Day}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] font-black text-brand-forest border-l-4 border-brand-gold pl-3 mb-3">Ownership & Roles</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{doc.ownershipAndRoles}</p>
          </section>
          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] font-black text-brand-forest border-l-4 border-brand-gold pl-3 mb-3">Success Metrics</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{doc.successMetrics}</p>
          </section>
        </div>

        <section className="bg-brand-forest text-white p-6 mt-10 rounded-sm">
          <h2 className="text-xs uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2">
            <Icons.Clipboard /> What To Do With This Document
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <p className="font-bold text-brand-gold mb-1">Distribution</p>
              <p className="opacity-80">{doc.pdfUsageInstructions.whoShouldReceive}</p>
            </div>
            <div>
              <p className="font-bold text-brand-gold mb-1">Meeting Application</p>
              <p className="opacity-80">{doc.pdfUsageInstructions.meetingUsage}</p>
            </div>
            <div>
              <p className="font-bold text-brand-gold mb-1">Strategic Support</p>
              <p className="opacity-80">{doc.pdfUsageInstructions.decisionSupport}</p>
            </div>
            <div>
              <p className="font-bold text-brand-gold mb-1 underline">Next 72 Hours</p>
              <p className="opacity-80">{doc.pdfUsageInstructions.immediateAction}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-brand-stone flex justify-between items-center no-print">
        <p className="text-[10px] text-brand-sage uppercase font-bold tracking-widest">LBJ Landscape Architecture Lead Intelligence System</p>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-brand-forest text-white px-6 py-2 rounded-sm text-xs font-bold hover:bg-brand-charcoal transition-all shadow-lg"
        >
          <Icons.Download /> Download as PDF
        </button>
      </div>
      
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .printable-area { border: none !important; box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
        }
      `}</style>
    </div>
  );
};

export default DeliverableView;
