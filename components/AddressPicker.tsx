
import React, { useState, useEffect } from 'react';
import { Address } from '../types';

interface AddressPickerProps {
  address: Address;
  onSave: (address: Address) => void;
  onCancel: () => void;
}

interface ValidationState {
  fullName: boolean | null;
  line1: boolean | null;
  city: boolean | null;
  pincode: boolean | null;
}

const MOCK_PUNE_SUGGESTIONS = [
  "Apt 402, Highrise Residency, Yerwada, Pune",
  "Plot 12, Koregaon Park Lane 7, Pune",
  "Flat 101, Sapphire Heights, Baner, Pune",
  "Bunglow 4, Viman Nagar Society, Pune",
  "Street 21, MG Road, Camp area, Pune"
];

// Define InputWrapper outside to avoid re-creation on every render and fix prop typing issues
const InputWrapper: React.FC<{
  label: string;
  field: keyof ValidationState;
  children: React.ReactNode;
  isValid: boolean | null;
}> = ({ label, children, isValid }) => (
  <div className="space-y-1.5 relative">
    <div className="flex justify-between items-center px-1">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      {isValid === true && (
        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Valid
        </span>
      )}
      {isValid === false && (
        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter flex items-center gap-1">
          Invalid
        </span>
      )}
    </div>
    {children}
  </div>
);

export const AddressPicker: React.FC<AddressPickerProps> = ({ address, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Address>(address);
  const [isDetecting, setIsDetecting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [validation, setValidation] = useState<ValidationState>({
    fullName: null,
    line1: null,
    city: null,
    pincode: null
  });

  // Basic real-time validation
  useEffect(() => {
    setValidation({
      fullName: formData.fullName.trim().length > 2,
      line1: formData.line1.trim().length > 5,
      city: formData.city.trim().length > 2,
      pincode: /^\d{6}$/.test(formData.pincode)
    });
  }, [formData]);

  const handleDetectLocation = () => {
    setIsDetecting(true);
    // Simulate high-precision GPS detection
    setTimeout(() => {
      setFormData({
        fullName: formData.fullName || 'Rahul Sharma',
        line1: 'Apt 402, Highrise Residency, Yerwada',
        city: 'Pune',
        pincode: '411006'
      });
      setIsDetecting(false);
    }, 1200);
  };

  const handleLine1Change = (val: string) => {
    setFormData({ ...formData, line1: val });
    if (val.length > 2) {
      const filtered = MOCK_PUNE_SUGGESTIONS.filter(s => s.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (s: string) => {
    const parts = s.split(', ');
    setFormData({
      ...formData,
      line1: parts[0] + (parts[1] ? ', ' + parts[1] : ''),
      city: parts[2] || 'Pune',
      pincode: parts[3] ? parts[3].split(' ')[1] : formData.pincode
    });
    setShowSuggestions(false);
  };

  const isFormValid = Object.values(validation).every(v => v === true);

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom duration-500">
      {/* Interactive Map Header */}
      <div className="h-56 w-full bg-slate-100 relative overflow-hidden group">
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
          <path d="M0 20h400M0 80h400M0 140h400M0 200h400M50 0v300M150 0v300M250 0v300M350 0v300" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="200" cy="110" r="100" fill="#10B981" fillOpacity="0.05" />
          <path d="M100 100l200 100M50 150l300-50" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
        </svg>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-transform group-hover:scale-110">
          <div className="relative">
            <div className="w-12 h-12 bg-emerald-600 rounded-full rounded-bl-none rotate-45 flex items-center justify-center border-4 border-white shadow-2xl shadow-emerald-200 ring-8 ring-emerald-500/10">
              <div className="w-3.5 h-3.5 bg-white rounded-full -rotate-45" />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900/80 backdrop-blur-sm text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Refill Destination
            </div>
          </div>
        </div>

        <button 
          onClick={handleDetectLocation}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-2.5 active:scale-95 transition-all hover:bg-white"
        >
          {isDetecting ? (
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="w-4 h-4 text-emerald-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          )}
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{isDetecting ? 'Detecting...' : 'Current Location'}</span>
        </button>
      </div>

      <div className="p-6 space-y-7 flex-1 overflow-y-auto">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Shipping</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Select your refill destination</p>
        </div>

        <div className="space-y-5">
          <InputWrapper label="Full Recipient Name" field="fullName" isValid={validation.fullName}>
            <input 
              type="text" 
              placeholder="e.g. Rahul Sharma"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className={`w-full bg-slate-50 border p-4.5 rounded-[22px] text-sm font-bold tracking-tight focus:ring-4 transition-all outline-none ${
                validation.fullName === true ? 'border-emerald-100 focus:ring-emerald-500/10' : 
                validation.fullName === false ? 'border-rose-100 focus:ring-rose-500/10' : 
                'border-slate-100 focus:ring-slate-500/5'
              }`}
            />
          </InputWrapper>

          <InputWrapper label="Address Line & Locality" field="line1" isValid={validation.line1}>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Building, Street name"
                value={formData.line1}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(e) => handleLine1Change(e.target.value)}
                className={`w-full bg-slate-50 border p-4.5 rounded-[22px] text-sm font-bold tracking-tight focus:ring-4 transition-all outline-none ${
                  validation.line1 === true ? 'border-emerald-100 focus:ring-emerald-500/10' : 
                  validation.line1 === false ? 'border-rose-100 focus:ring-rose-500/10' : 
                  'border-slate-100 focus:ring-slate-500/5'
                }`}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-[24px] shadow-2xl z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 border-b border-slate-50 bg-slate-50/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-3">Recent Locations Pune</span>
                  </div>
                  {suggestions.map((s, idx) => (
                    <button 
                      key={idx}
                      onClick={() => selectSuggestion(s)}
                      className="w-full px-5 py-3.5 text-left hover:bg-emerald-50 transition-colors flex items-center gap-3 border-b border-slate-50 last:border-none"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/30 flex items-center justify-center shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                         </svg>
                      </div>
                      <span className="text-xs font-bold text-slate-700 leading-tight">{s}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </InputWrapper>

          <div className="grid grid-cols-2 gap-5">
            <InputWrapper label="City / Region" field="city" isValid={validation.city}>
              <input 
                type="text" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className={`w-full bg-slate-50 border p-4.5 rounded-[22px] text-sm font-bold tracking-tight focus:ring-4 transition-all outline-none ${
                  validation.city === true ? 'border-emerald-100 focus:ring-emerald-500/10' : 
                  validation.city === false ? 'border-rose-100 focus:ring-rose-500/10' : 
                  'border-slate-100 focus:ring-slate-500/5'
                }`}
              />
            </InputWrapper>
            <InputWrapper label="Pincode" field="pincode" isValid={validation.pincode}>
              <input 
                type="text" 
                maxLength={6}
                placeholder="6 Digits"
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})}
                className={`w-full bg-slate-50 border p-4.5 rounded-[22px] text-sm font-bold tracking-tight focus:ring-4 transition-all outline-none ${
                  validation.pincode === true ? 'border-emerald-100 focus:ring-emerald-500/10' : 
                  validation.pincode === false ? 'border-rose-100 focus:ring-rose-500/10' : 
                  'border-slate-100 focus:ring-slate-500/5'
                }`}
              />
            </InputWrapper>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100">
        <div className="flex gap-4">
          <button 
            onClick={() => onSave(formData)}
            disabled={!isFormValid}
            className={`flex-1 py-5 rounded-[24px] font-black text-sm shadow-2xl transition-all active:scale-95 ${
              isFormValid 
                ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            Confirm Address
          </button>
          <button 
            onClick={onCancel}
            className="px-8 bg-slate-900 text-white py-5 rounded-[24px] font-black text-sm active:scale-95 transition-all hover:bg-black"
          >
            Cancel
          </button>
        </div>
        <p className="text-center mt-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Verified Pharmacy Logistics Network</p>
      </div>
    </div>
  );
};
