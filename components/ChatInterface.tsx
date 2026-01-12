
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, FileData } from '../types';
import { Icons } from '../constants';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string, file?: FileData) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert("Currently, we only support PDF documents for automated analysis. Please convert your file to PDF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      setSelectedFile({
        fileName: file.name,
        inlineData: {
          data: base64,
          mimeType: 'application/pdf'
        }
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || selectedFile) && !isLoading) {
      onSendMessage(input.trim(), selectedFile || undefined);
      setInput('');
      setSelectedFile(null);
    }
  };

  const handleSpeech = () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech recognition is not supported in this browser.");
        return;
    }
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
    };
    recognition.start();
  };

  return (
    <div 
      className={`flex flex-col h-full bg-white premium-shadow border rounded-sm transition-all duration-300 ${isDragging ? 'border-brand-gold ring-2 ring-brand-gold ring-opacity-20 bg-brand-stone/10' : 'border-brand-stone'}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="px-6 py-4 border-b border-brand-stone flex items-center justify-between relative overflow-hidden">
        {isDragging && (
          <div className="absolute inset-0 bg-brand-gold/10 flex items-center justify-center z-10 animate-pulse">
            <p className="text-brand-forest font-bold text-xs uppercase tracking-widest">Drop Project Brief PDF Here</p>
          </div>
        )}
        <h3 className="font-serif text-brand-forest font-semibold text-lg flex items-center gap-2">
          <Icons.Sparkles /> Concierge Interaction
        </h3>
        <div className="flex gap-2">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-[10px] text-brand-sage uppercase font-bold">Secure Intel</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF9F6]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4">
             <div className="w-16 h-16 bg-brand-stone rounded-full flex items-center justify-center text-brand-forest">
               <Icons.Leaf />
             </div>
             <div>
               <h4 className="font-serif text-xl text-brand-forest">Welcome to LBJ-Sales-AI</h4>
               <p className="text-brand-sage text-sm max-w-xs mx-auto">Paste an email, record a transcript, or drop a PDF brief for automated analysis.</p>
             </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-4 rounded-sm relative ${
              m.role === 'ai' 
                ? 'bg-white text-brand-charcoal border border-brand-stone shadow-sm' 
                : 'bg-brand-forest text-white'
            }`}>
              <div className="text-xs mb-1 opacity-60 uppercase font-bold tracking-tighter flex justify-between">
                <span>{m.role === 'ai' ? 'LBJ Concierge' : 'Prospect'}</span>
                {m.fileName && <span className="italic flex items-center gap-1"><Icons.FileText /> {m.fileName}</span>}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-sm">
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-brand-stone p-4 rounded-sm animate-pulse flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-sage rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-brand-sage rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-brand-sage rounded-full animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-xs text-brand-sage font-medium italic">Analyzing lead quality...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-brand-stone">
        {selectedFile && (
          <div className="mb-3 p-2 bg-brand-stone/30 border border-brand-stone rounded-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-brand-forest font-medium">
              <Icons.FileText /> {selectedFile.fileName}
            </div>
            <button 
              type="button" 
              onClick={() => setSelectedFile(null)}
              className="text-red-600 hover:text-red-800 font-bold px-2"
            >
              ×
            </button>
          </div>
        )}
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
               if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
               }
            }}
            placeholder="Type, paste inquiry, or drop a PDF..."
            className="w-full bg-brand-stone/30 border border-brand-stone p-4 pr-32 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold min-h-[100px] resize-none transition-all duration-300"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-brand-sage hover:text-brand-forest hover:bg-white rounded-full transition-all duration-200"
              title="Attach PDF"
            >
              <Icons.FileText />
            </button>
            <button
              type="button"
              onClick={handleSpeech}
              className="p-2 text-brand-sage hover:text-brand-forest hover:bg-white rounded-full transition-all duration-200"
              title="Voice Input"
            >
              <Icons.Mic />
            </button>
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !selectedFile)}
              className={`p-2 rounded-full transition-all duration-300 ${
                isLoading || (!input.trim() && !selectedFile)
                  ? 'text-brand-stone bg-gray-50' 
                  : 'text-white bg-brand-forest hover:bg-brand-charcoal shadow-md'
              }`}
            >
              <Icons.Send />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
