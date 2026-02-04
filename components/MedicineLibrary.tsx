
import React, { useState } from 'react';
import { MEDICINE_MASTER_DATA } from '../constants';
import { Medicine } from '../types';

const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Heart': return 'bg-rose-50 text-rose-600 border-rose-100';
    case 'Diabetes': return 'bg-sky-50 text-sky-600 border-sky-100';
    case 'Pain': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'Stomach': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'Heart':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      );
    case 'Diabetes':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L14.586 11H3a1 1 0 100 2h11.586l-8.293 8.293a1 1 0 101.414 1.414l10-10a1 1 0 000-1.414l-10-10A1 1 0 007 2z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      );
  }
};

export const MedicineLibrary: React.FC = () => {
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedicines = MEDICINE_MASTER_DATA.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedMed) {
    return (
      <div className="p-6 space-y-8 animate-in slide-in-from-right duration-300">
        <button 
          onClick={() => setSelectedMed(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold text-sm transition-colors group"
        >
          <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          Back to Library
        </button>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm ${selectedMed.prescriptionRequired ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                {selectedMed.prescriptionRequired ? 'Rx Required' : 'Over the Counter'}
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm ${getCategoryStyles(selectedMed.category)}`}>
                {selectedMed.category}
              </span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">{selectedMed.name}</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-slate-600 font-bold text-sm bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                {selectedMed.dosage}
              </div>
              <div className="text-slate-400 text-sm font-medium italic">
                {selectedMed.stock} units available
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
             {[
               { title: 'Clinical Overview', content: selectedMed.description, icon: <OverviewIcon /> },
               { title: 'Usage Protocol', content: selectedMed.usage, icon: <ProtocolIcon /> },
               { title: 'Adverse Reactions', content: selectedMed.sideEffects, icon: <SideEffectIcon /> }
             ].map((section, idx) => (
               <div key={idx} className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm space-y-4 hover:border-emerald-100 transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-600">
                      {section.icon}
                    </div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{section.title}</h4>
                 </div>
                 <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{section.content}</p>
               </div>
             ))}
          </div>
          
          <div className="pt-4">
            <button className="w-full bg-slate-900 text-white py-5 rounded-[28px] font-bold text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Add to Active Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medicine Library</h2>
        <p className="text-slate-500 text-sm font-medium">Search clinical data for verified medicines.</p>
      </div>
      
      <div className="relative group">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by generic or brand name..." 
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[24px] text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm group-hover:border-emerald-200"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="space-y-5">
        {filteredMedicines.map(med => (
          <button 
            key={med.id}
            onClick={() => setSelectedMed(med)}
            className="w-full flex flex-col p-6 bg-white border border-slate-100 rounded-[32px] hover:border-emerald-200 transition-all text-left shadow-sm active:scale-[0.98] group relative overflow-hidden"
          >
            {/* Header: Name & Avatar */}
            <div className="flex items-start justify-between relative z-10 w-full mb-3">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-colors shadow-inner border border-white/50 ${getCategoryStyles(med.category)}`}>
                  <span className="text-2xl font-black">{med.name[0]}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-[20px] tracking-tight group-hover:text-emerald-700 transition-colors">{med.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                     <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm ${getCategoryStyles(med.category)}`}>
                        <CategoryIcon category={med.category} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{med.category}</span>
                     </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {med.prescriptionRequired && (
                   <span className="bg-rose-50 text-rose-600 border border-rose-100 px-2 py-1 rounded-lg flex items-center gap-1.5">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                       <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                     </svg>
                     <span className="text-[9px] font-black uppercase tracking-tighter">Rx Needed</span>
                   </span>
                 )}
              </div>
            </div>

            {/* Tags & Dosage */}
            <div className="flex items-center gap-2 mb-4">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Dosage</span>
               <span className="text-[11px] font-bold text-slate-700 px-3 py-1 bg-slate-100 rounded-xl border border-slate-200/50">
                  {med.dosage}
               </span>
            </div>
            
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium mb-5 pr-4">
              {med.description}
            </p>

            {/* Availability & Pricing Section */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 relative z-10">
               <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Price / {med.unit}</span>
                  <div className="text-xl font-black text-slate-900 tracking-tighter">₹{med.price}</div>
               </div>
               <div className="space-y-1 text-right">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Availability</span>
                  <div className={`flex items-center justify-end gap-1.5 font-bold text-sm ${med.stock < 100 ? 'text-rose-500' : 'text-emerald-600'}`}>
                     <div className={`w-1.5 h-1.5 rounded-full ${med.stock < 100 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-600'}`} />
                     {med.stock < 100 ? 'Low Stock' : 'In Stock'} ({med.stock})
                  </div>
               </div>
            </div>

            {/* Interaction Cue */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg transform translate-x-4 group-hover:translate-x-0 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
               </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/20 rounded-full -translate-y-1/2 translate-x-1/2 -z-0" />
          </button>
        ))}
        {filteredMedicines.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-200">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <p className="text-slate-400 font-bold text-sm tracking-tight">No medicines found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const OverviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ProtocolIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
  </svg>
);
const SideEffectIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
