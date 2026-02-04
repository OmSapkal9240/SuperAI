
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, MessageRole, OrderDraft, Medicine } from '../types';
import { MEDICINE_MASTER_DATA } from '../constants';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isListening: boolean;
  onToggleMic: () => void;
  onSendMessage: (text: string) => void;
  status: 'idle' | 'connected' | 'connecting' | 'closed';
  orderDraft: OrderDraft;
  onConfirmOrder: () => void;
  onChangeAddress: () => void;
  onSelectMedicine: (medicine: Medicine) => void;
}

// Simple Markdown-lite renderer
const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*|\n)/g);
  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part === '\n') return <br key={i} />;
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-black text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </div>
  );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  isListening, 
  onToggleMic, 
  onSendMessage,
  status,
  orderDraft,
  onConfirmOrder,
  onChangeAddress,
  onSelectMedicine
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [
    "Check my last order",
    "How to take Metformin?",
    "Price of Amlodipine",
    "Side effects of Pantoprazole"
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, orderDraft.medicine]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === MessageRole.USER) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [messages]);

  const findMedicineInText = (text: string): Medicine | undefined => {
    return MEDICINE_MASTER_DATA.find(med => 
      text.toLowerCase().includes(med.name.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 relative overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-48">
        {messages.length === 0 && !orderDraft.medicine && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 px-10 py-12 animate-in fade-in zoom-in-95">
            <div className="w-24 h-24 bg-white rounded-[40px] shadow-2xl shadow-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-50 relative">
              <div className="absolute inset-0 bg-emerald-500/5 rounded-[40px] animate-pulse" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">AI Voice Assistant</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[240px] mx-auto">
                Ask me about your medicines, refills, or clinical information.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const detectedMed = msg.role === MessageRole.BOT ? findMedicineInText(msg.text) : null;
          
          return (
            <div key={msg.id} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className="max-w-[88%] flex flex-col items-start gap-2">
                <div className={`px-5 py-3.5 rounded-[28px] text-[15px] leading-relaxed shadow-sm transition-all ${
                  msg.role === MessageRole.USER 
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-emerald-200/50 font-bold' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none font-medium'
                }`}>
                  {msg.text ? <MarkdownText text={msg.text} /> : (
                    <div className="flex gap-1.5 py-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150" />
                    </div>
                  )}
                </div>
                
                {detectedMed && msg.text && (
                  <button 
                    onClick={() => onSelectMedicine(detectedMed)}
                    className="ml-4 flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                  >
                    Quick Order: {detectedMed.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && messages[messages.length-1]?.role === MessageRole.USER && (
          <div className="flex justify-start animate-in fade-in duration-300">
             <div className="bg-white border border-slate-100 px-5 py-4 rounded-[28px] rounded-bl-none shadow-sm flex gap-1.5 items-center">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mr-2">Pharmacist Thinking</span>
                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-75" />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse delay-150" />
             </div>
          </div>
        )}

        {/* Order Confirmation Card */}
        {orderDraft.medicine && (
          <div className="bg-white border-2 border-emerald-100 rounded-[32px] p-6 shadow-2xl shadow-emerald-500/10 space-y-6 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -translate-y-12 translate-x-12" />
            
            <div className="flex items-center gap-4 relative">
              <div className="w-14 h-14 bg-emerald-600 rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg tracking-tight">Ready for Pickup</h3>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Verified Inventory Match</p>
              </div>
            </div>

            <div className="space-y-4 p-5 bg-slate-50/50 rounded-[24px] border border-slate-100">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="font-black text-slate-800 text-sm">{orderDraft.medicine.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{orderDraft.medicine.dosage} • {orderDraft.medicine.unit}</p>
                </div>
                <div className="text-right">
                   <p className="text-lg font-black text-emerald-700 tracking-tighter">₹{orderDraft.medicine.price}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={onConfirmOrder}
                className="flex-1 bg-emerald-600 text-white py-4.5 rounded-[22px] font-black text-sm shadow-xl shadow-emerald-200 active:scale-[0.98] transition-all hover:bg-emerald-700"
              >
                Place Order Now
              </button>
              <button 
                onClick={() => onSendMessage("Cancel order")}
                className="px-6 bg-white border border-slate-100 text-slate-400 py-4.5 rounded-[22px] font-bold text-sm active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Tray */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-2xl border-t border-slate-100 pt-6">
        <div className="flex flex-col gap-4">
          {/* Quick Suggestions */}
          {!isListening && messages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => onSendMessage(s)}
                  className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 bg-white p-2.5 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 ring-4 ring-slate-100/30">
            <button 
              onClick={onToggleMic}
              className={`w-14 h-14 rounded-[24px] flex items-center justify-center transition-all shrink-0 active:scale-90 ${
                isListening ? 'bg-red-500 shadow-xl shadow-red-100' : 'bg-emerald-600 shadow-xl shadow-emerald-100 hover:bg-emerald-700'
              }`}
            >
              {isListening ? (
                <div className="flex items-center gap-0.5">
                   <div className="w-1 h-4 bg-white rounded-full animate-pulse" />
                   <div className="w-1 h-6 bg-white rounded-full animate-pulse delay-75" />
                   <div className="w-1 h-4 bg-white rounded-full animate-pulse delay-150" />
                </div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Message SmartRx..."}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold py-3 px-1 text-slate-800 placeholder:text-slate-300"
            />

            <button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`w-12 h-12 rounded-[20px] flex items-center justify-center transition-all shrink-0 ${
                inputText.trim() ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
