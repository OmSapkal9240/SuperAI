
import React from 'react';

interface SuccessScreenProps {
  onDone: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onDone }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-10 animate-in fade-in zoom-in-95 duration-500 bg-white">
      <div className="relative">
        <div className="w-28 h-28 bg-emerald-600 rounded-[40px] flex items-center justify-center text-white shadow-[0_20px_60px_-15px_rgba(5,150,105,0.4)] relative z-10 animate-in slide-in-from-bottom duration-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="absolute -inset-4 bg-emerald-100/40 rounded-full animate-ping duration-[3s] -z-0" />
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Transaction Success</span>
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">Order Placed</h2>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mx-auto font-medium">
          Refill request <span className="text-slate-900 font-bold tracking-tight">#RX92831</span> is being fulfilled by our certified pharmacy.
        </p>
      </div>

      <div className="w-full space-y-3">
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] space-y-5 shadow-inner">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Est. Delivery</span>
            <span className="text-slate-900 font-extrabold tracking-tight">Today, 4:30 PM</span>
          </div>
          <div className="h-px bg-slate-200/50 w-full"></div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Pharmacy Location</span>
            <span className="text-slate-900 font-extrabold tracking-tight">SmartRx Hub, Pune</span>
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={onDone}
          className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-bold text-sm shadow-2xl active:scale-[0.98] transition-all hover:bg-black"
        >
          View Tracking Details
        </button>
        <button 
          onClick={onDone}
          className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-emerald-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 pt-4 opacity-40">
        <div className="flex items-center gap-1.5">
           <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
           </svg>
           <span className="text-[10px] font-black uppercase tracking-widest">GDA Encrypted Order</span>
        </div>
      </div>
    </div>
  );
};
