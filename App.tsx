
import React, { useState, useCallback, useMemo } from 'react';
import ChatInterface from './components/ChatInterface';
import BriefView from './components/BriefView';
import DeliverableView from './components/DeliverableView';
import { ChatMessage, SalesBrief, FileData, ActionDocument } from './types';
import { SalesAIService } from './services/geminiService';
import { Icons } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentBrief, setCurrentBrief] = useState<SalesBrief | undefined>();
  const [actionDoc, setActionDoc] = useState<ActionDocument | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'brief' | 'deliverable'>('brief');

  const salesAI = useMemo(() => new SalesAIService(), []);

  const handleSendMessage = useCallback(async (content: string, file?: FileData) => {
    setIsLoading(true);
    setError(null);

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content || (file ? `[Uploaded file: ${file.fileName}]` : ""),
      timestamp: new Date(),
      fileName: file?.fileName,
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await salesAI.processLead(messages, content, file);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.clientFriendlyResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setCurrentBrief(response.salesBrief);
      
      if (response.actionDocument) {
        setActionDoc(response.actionDocument);
        setActiveTab('deliverable');
      }
    } catch (err) {
      console.error(err);
      setError("The concierge encountered a brief technical issue while processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [messages, salesAI]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Premium Navigation */}
      <nav className="bg-brand-forest text-white py-6 px-8 flex justify-between items-center premium-shadow z-10 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold rounded-sm text-brand-forest">
            <Icons.Leaf />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight">LBJ-SALES-AI</h1>
            <p className="text-[10px] text-brand-gold uppercase tracking-[0.3em] font-semibold opacity-80">Lead Intelligence Suite</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest font-bold text-brand-sage">
           <span className="hover:text-white cursor-pointer transition-colors">Dashboard</span>
           <span className="hover:text-white cursor-pointer transition-colors">Insights</span>
           <span className="text-brand-gold bg-brand-charcoal px-4 py-2 rounded-sm border border-brand-gold/20">Concierge Active</span>
        </div>
      </nav>

      <main className="flex-1 container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full max-h-[calc(100vh-100px)]">
        {/* Left Column: Chat Interaction */}
        <div className="lg:col-span-5 xl:col-span-4 h-full flex flex-col no-print">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
          />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Intelligence & Deliverables */}
        <div className="lg:col-span-7 xl:col-span-8 h-full overflow-y-auto pr-2 custom-scroll">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between border-b border-brand-stone pb-4 no-print">
             <div className="mb-4 sm:mb-0">
               <h2 className="font-serif text-3xl text-brand-forest font-bold">Project Intelligence</h2>
               <p className="text-brand-sage text-sm italic">Automated synthesis and strategic roadmaps</p>
             </div>
             
             <div className="flex bg-brand-stone/20 p-1 rounded-sm border border-brand-stone/40">
                <button 
                  onClick={() => setActiveTab('brief')}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'brief' ? 'bg-white text-brand-forest shadow-sm' : 'text-brand-sage hover:text-brand-forest'}`}
                >
                  Internal Brief
                </button>
                <button 
                  disabled={!actionDoc}
                  onClick={() => setActiveTab('deliverable')}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'deliverable' ? 'bg-white text-brand-forest shadow-sm' : 'text-brand-sage hover:text-brand-forest'} disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                  Action Plan {actionDoc && <span className="ml-1 text-brand-gold">●</span>}
                </button>
             </div>
          </div>
          
          <div className="pb-10">
            {activeTab === 'brief' ? (
              <>
                <BriefView brief={currentBrief} isLoading={isLoading} />
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
                  <MetricCard 
                    label="Lead Readiness" 
                    value={currentBrief ? "Qualified" : "Analyzing"} 
                    status={currentBrief ? "success" : "neutral"}
                  />
                  <MetricCard 
                    label="Data Accuracy" 
                    value={currentBrief ? "High" : "N/A"} 
                    status={currentBrief ? "success" : "neutral"}
                  />
                  <MetricCard 
                    label="AI Confidence" 
                    value={currentBrief ? "98%" : "Analyzing"} 
                    status="neutral"
                  />
                </div>
              </>
            ) : (
              actionDoc && <DeliverableView doc={actionDoc} />
            )}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-[10px] text-brand-sage uppercase tracking-widest bg-white border-t border-brand-stone no-print">
        © 2025 LBJ Landscape Architecture & Design • Confidential Lead Data Protocol
      </footer>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; status: 'success' | 'warning' | 'neutral' }> = ({ label, value, status }) => {
  const statusColor = {
    success: 'text-green-600',
    warning: 'text-orange-600',
    neutral: 'text-brand-sage'
  };

  return (
    <div className="bg-white p-4 border border-brand-stone rounded-sm flex flex-col gap-1 premium-shadow">
      <span className="text-[10px] uppercase font-bold text-brand-sage opacity-70">{label}</span>
      <span className={`text-sm font-bold ${statusColor[status]}`}>{value}</span>
    </div>
  );
};

export default App;
