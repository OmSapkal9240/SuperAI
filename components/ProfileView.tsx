
import React, { useState } from 'react';
import { Address } from '../types';

export const ProfileView: React.FC = () => {
  const [name, setName] = useState('Rahul Sharma');
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [language, setLanguage] = useState('Hinglish');

  // Address Management State
  const [addresses, setAddresses] = useState<Address[]>([
    {
      fullName: 'Rahul Sharma',
      line1: '21, MG Road, Pune',
      city: 'Pune',
      pincode: '411001'
    }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempAddress, setTempAddress] = useState<Address>({
    fullName: '',
    line1: '',
    city: 'Pune',
    pincode: ''
  });

  const handleAddClick = () => {
    setTempAddress({ fullName: name, line1: '', city: 'Pune', pincode: '' });
    setIsAdding(true);
    setEditingIndex(null);
  };

  const handleEditClick = (index: number) => {
    setTempAddress(addresses[index]);
    setEditingIndex(index);
    setIsAdding(false);
  };

  const handleDeleteAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleSaveAddress = () => {
    if (editingIndex !== null) {
      const newAddresses = [...addresses];
      newAddresses[editingIndex] = tempAddress;
      setAddresses(newAddresses);
      setEditingIndex(null);
    } else {
      setAddresses([...addresses, tempAddress]);
      setIsAdding(false);
    }
  };

  const isFormValid = tempAddress.fullName.trim().length > 2 && 
                      tempAddress.line1.trim().length > 5 && 
                      /^\d{6}$/.test(tempAddress.pincode);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative group">
          <div className="w-28 h-28 rounded-[40px] border-4 border-white shadow-2xl overflow-hidden bg-slate-100">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" 
              alt="Rahul Sharma" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg active:scale-90 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Rahul Sharma</h2>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em]">Premium Member</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Personal Details</h3>
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Phone Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Saved Addresses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saved Addresses</h3>
            {!isAdding && editingIndex === null && (
              <button 
                onClick={handleAddClick}
                className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New
              </button>
            )}
          </div>

          <div className="space-y-3">
            {addresses.map((addr, idx) => (
              editingIndex === idx ? (
                <AddressForm 
                  key={idx}
                  tempAddress={tempAddress}
                  setTempAddress={setTempAddress}
                  onSave={handleSaveAddress}
                  onCancel={() => setEditingIndex(null)}
                  isValid={isFormValid}
                />
              ) : (
                <div key={idx} className="bg-white border border-slate-100 p-5 rounded-[28px] shadow-sm flex items-start justify-between group transition-all hover:border-emerald-100">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">{addr.fullName}</h4>
                    <p className="text-xs text-slate-500 font-medium">{addr.line1}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{addr.city} • {addr.pincode}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditClick(idx)}
                      className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteAddress(idx)}
                      className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            ))}

            {isAdding && (
              <AddressForm 
                tempAddress={tempAddress}
                setTempAddress={setTempAddress}
                onSave={handleSaveAddress}
                onCancel={() => setIsAdding(false)}
                isValid={isFormValid}
              />
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">App Preferences</h3>
          <div className="bg-white border border-slate-100 rounded-[32px] p-4 shadow-sm divide-y divide-slate-50">
            <div className="p-4 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Voice Language</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{language}</p>
                </div>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-emerald-600 uppercase tracking-widest focus:ring-0 cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Hinglish">Hinglish</option>
              </select>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Notifications</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Refill reminders active</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-emerald-600 rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Legal */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Trust & Security</h3>
          <div className="bg-slate-900 rounded-[32px] p-4 divide-y divide-slate-800">
            <button className="w-full p-4 flex items-center justify-between text-left group">
              <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Privacy Policy</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="w-full p-4 flex items-center justify-between text-left group">
              <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Digital Health Records</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <button className="w-full py-5 rounded-[24px] bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all active:scale-[0.98]">
          Sign Out of SmartRx
        </button>
      </div>

      <div className="text-center space-y-2 opacity-30 pt-4 pb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">App Version 2.4.1 (Stable)</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Node ID: PHARM-2921-X</p>
      </div>
    </div>
  );
};

interface AddressFormProps {
  tempAddress: Address;
  setTempAddress: (a: Address) => void;
  onSave: () => void;
  onCancel: () => void;
  isValid: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ tempAddress, setTempAddress, onSave, onCancel, isValid }) => (
  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-5 space-y-4 animate-in slide-in-from-top-2 duration-300">
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Recipient</label>
        <input 
          type="text" 
          value={tempAddress.fullName}
          onChange={(e) => setTempAddress({ ...tempAddress, fullName: e.target.value })}
          placeholder="Full Name"
          className="w-full bg-white border border-slate-100 p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Address Details</label>
        <input 
          type="text" 
          value={tempAddress.line1}
          onChange={(e) => setTempAddress({ ...tempAddress, line1: e.target.value })}
          placeholder="Building, Street, Locality"
          className="w-full bg-white border border-slate-100 p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
          <input 
            type="text" 
            value={tempAddress.city}
            onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
            className="w-full bg-white border border-slate-100 p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode</label>
          <input 
            type="text" 
            maxLength={6}
            value={tempAddress.pincode}
            onChange={(e) => setTempAddress({ ...tempAddress, pincode: e.target.value.replace(/\D/g, '') })}
            placeholder="6-digits"
            className="w-full bg-white border border-slate-100 p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>
    </div>
    <div className="flex gap-2 pt-2">
      <button 
        disabled={!isValid}
        onClick={onSave}
        className={`flex-1 py-3 rounded-xl font-bold text-xs shadow-sm transition-all ${isValid ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
      >
        Save Address
      </button>
      <button 
        onClick={onCancel}
        className="px-4 py-3 rounded-xl bg-white border border-slate-100 text-slate-500 font-bold text-xs"
      >
        Cancel
      </button>
    </div>
  </div>
);
