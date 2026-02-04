
import React from 'react';
import { MEDICINE_MASTER_DATA, MOCK_REFILL_ALERTS } from '../constants';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Proactive Refill Alerts</h3>
        <div className="space-y-3">
          {MOCK_REFILL_ALERTS.map(alert => (
            <div key={alert.id} className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800">{alert.userName}</h4>
                <p className="text-sm text-slate-600">{alert.medicineName} running out in {alert.daysRemaining} days</p>
              </div>
              <button className="bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-bold">Initiate</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Inventory Status</h3>
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          {MEDICINE_MASTER_DATA.map((med, i) => (
            <div key={med.id} className={`p-4 flex items-center justify-between ${i !== MEDICINE_MASTER_DATA.length - 1 ? 'border-b border-slate-50' : ''}`}>
              <div>
                <h4 className="font-semibold text-slate-800">{med.name} <span className="text-xs font-normal text-slate-400">({med.dosage})</span></h4>
                <p className="text-sm text-slate-500">₹{med.price} per {med.unit}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${med.stock < 100 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {med.stock} left
                </span>
                {med.prescriptionRequired && (
                  <p className="text-[10px] text-red-400 mt-1 uppercase font-bold tracking-tighter">Rx Required</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
