
import React from 'react';
import { MOCK_USER_HISTORY } from '../constants';

export const OrdersView: React.FC = () => {
  return (
    <div className="p-5 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Order History</h2>
      
      <div className="space-y-4">
        {MOCK_USER_HISTORY.map(order => (
          <div key={order.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{order.medicineName}</h3>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{order.date}</p>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="text-xs font-bold text-slate-500">
                Quantity: <span className="text-slate-800">{order.quantity} units</span>
              </div>
              <div className="text-lg font-bold text-emerald-600">
                ₹{order.price}
              </div>
            </div>

            <button className="w-full py-3 rounded-2xl bg-slate-50 text-slate-600 text-sm font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
              Reorder Instantly
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
