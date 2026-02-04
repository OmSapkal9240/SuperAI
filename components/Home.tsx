
import React from 'react';
import { AppScreen, Medicine } from '../types';
import { MOCK_REFILL_ALERTS, MEDICINE_MASTER_DATA } from '../constants';

interface HomeProps {
  onNavigate: (screen: AppScreen) => void;
  onOrderMedicine: (med: Medicine) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onOrderMedicine }) => {
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1.5">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Namaste, Rahul</h2>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200"></div>
            ))}
          </div>
          <p className="text-slate-500 text-xs font-medium">Join 2.5k+ health-conscious Pune residents</p>
        </div>
      </div>

      {/* Main Refill Card - Ultra Premium */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-[32px] p-7 text-white shadow-2xl shadow-emerald-100 relative overflow-hidden group">
        <div className="relative z-10 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">Refill Recommendation</span>
              <h3 className="text-2xl font-bold mt-3">Amlodipine 5mg</h3>
              <p className="text-emerald-50/80 text-sm">3 days of supply remaining</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <button 
            onClick={() => onOrderMedicine(MEDICINE_MASTER_DATA[0])}
            className="w-full bg-white text-emerald-700 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-emerald-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-emerald-50"
          >
            Refill Instantly
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="absolute top-[-30%] right-[-10%] w-64 h-64 bg-emerald-400/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-teal-400/10 rounded-full blur-[60px]" />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-5">
        <button 
          onClick={() => onNavigate('chat')}
          className="bg-white border border-slate-100 p-6 rounded-[28px] shadow-sm text-left group hover:border-emerald-500 transition-all hover:shadow-xl hover:shadow-emerald-500/5 active:scale-95"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </div>
          <h4 className="font-bold text-slate-900 leading-tight">AI Voice Assistant</h4>
          <p className="text-xs text-slate-400 mt-2 font-medium">Chat & Voice Orders</p>
        </button>

        <button 
          onClick={() => onNavigate('library')}
          className="bg-white border border-slate-100 p-6 rounded-[28px] shadow-sm text-left group hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/5 active:scale-95"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </div>
          <h4 className="font-bold text-slate-900 leading-tight">Health Library</h4>
          <p className="text-xs text-slate-400 mt-2 font-medium">Clinical Insights</p>
        </button>
      </div>

      {/* Trust & Safety Section */}
      <div className="bg-slate-900 rounded-[32px] p-6 text-white overflow-hidden relative">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.9L10 .155 17.834 4.9a2 2 0 011.166 1.814v3.52a4 4 0 01-1.076 2.747l-6.914 7.583a1 1 0 01-1.47 0l-6.914-7.583A4 4 0 011 10.234V6.714a2 2 0 011.166-1.814zM10 3.08L4.314 6.533v3.701a2 2 0 00.538 1.374L10 17.336l5.148-5.728a2 2 0 00.538-1.374V6.533L10 3.08zM12.707 8.293a1 1 0 00-1.414-1.414L9 9.172 8.707 8.879a1 1 0 00-1.414 1.414l1 1a1 1 0 001.414 0l3-3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold">Secure Delivery Protected</h4>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">100% GDA Compliant Storage</p>
          </div>
        </div>
      </div>

      <section className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ongoing Reminders</h3>
          <button className="text-emerald-600 text-xs font-bold hover:underline">Settings</button>
        </div>
        <div className="space-y-3">
          {MOCK_REFILL_ALERTS.map(alert => (
            <div key={alert.id} className="bg-white border border-slate-100 p-5 rounded-[24px] flex items-center justify-between group hover:border-emerald-200 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">{alert.medicineName}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{alert.daysRemaining} days left</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const med = MEDICINE_MASTER_DATA.find(m => m.name === alert.medicineName);
                  if (med) onOrderMedicine(med);
                }}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>
      
      <div className="pt-4 pb-8 flex justify-center">
        <div className="flex items-center gap-2 opacity-30">
          <div className="w-4 h-4 bg-slate-400 rounded-sm"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">ISO 27001 Certified</span>
        </div>
      </div>
    </div>
  );
};
