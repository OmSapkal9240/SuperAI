
import { Medicine, OrderHistory, RefillAlert } from './types';

export const MEDICINE_MASTER_DATA: Medicine[] = [
  { 
    id: '1', 
    name: 'Amlodipine', 
    dosage: '5mg', 
    description: 'A calcium channel blocker used to treat high blood pressure (hypertension).',
    usage: 'Take once daily at the same time, with or without food.',
    sideEffects: 'Swelling of feet or ankles, dizziness, or headache.',
    stock: 150, 
    unit: 'tablets', 
    prescriptionRequired: true, 
    price: 120,
    category: 'Heart'
  },
  { 
    id: '2', 
    name: 'Metformin', 
    dosage: '500mg', 
    description: 'An oral diabetes medicine that helps control blood sugar levels.',
    usage: 'Take with meals as directed by your doctor.',
    sideEffects: 'Nausea, stomach upset, or metallic taste in mouth.',
    stock: 200, 
    unit: 'tablets', 
    prescriptionRequired: true, 
    price: 85,
    category: 'Diabetes'
  },
  { 
    id: '3', 
    name: 'Paracetamol', 
    dosage: '650mg', 
    description: 'Commonly used to treat fever and mild to moderate pain.',
    usage: 'Maximum 4g per day. Do not exceed the recommended dose.',
    sideEffects: 'Generally safe, but excessive use can harm the liver.',
    stock: 500, 
    unit: 'tablets', 
    prescriptionRequired: false, 
    price: 30,
    category: 'General'
  },
  { 
    id: '4', 
    name: 'Atorvastatin', 
    dosage: '10mg', 
    description: 'Used along with diet to lower cholesterol and reduce risk of heart attack.',
    usage: 'Usually taken once a day, with or without food.',
    sideEffects: 'Joint pain, diarrhea, or muscle soreness.',
    stock: 80, 
    unit: 'tablets', 
    prescriptionRequired: true, 
    price: 210,
    category: 'Heart'
  },
  { 
    id: '5', 
    name: 'Pantoprazole', 
    dosage: '40mg', 
    description: 'A proton pump inhibitor that decreases the amount of acid produced in the stomach.',
    usage: 'Take 30-60 minutes before breakfast.',
    sideEffects: 'Headache, diarrhea, or flatulence.',
    stock: 120, 
    unit: 'capsules', 
    prescriptionRequired: false, 
    price: 95,
    category: 'Stomach'
  }
];

export const MOCK_USER_HISTORY: OrderHistory[] = [
  { id: 'o1', medicineId: '1', medicineName: 'Amlodipine', quantity: 30, date: '2024-04-15', status: 'Delivered', price: 120 },
  { id: 'o2', medicineId: '2', medicineName: 'Metformin', quantity: 60, date: '2024-03-20', status: 'Delivered', price: 170 }
];

export const MOCK_REFILL_ALERTS: RefillAlert[] = [
  { id: 'ra1', medicineName: 'Amlodipine', userName: 'Rahul Sharma', daysRemaining: 3 },
  { id: 'ra2', medicineName: 'Metformin', userName: 'Rahul Sharma', daysRemaining: 7 }
];

export const SYSTEM_INSTRUCTION = `
You are SmartRx, a premium AI Pharmacist. You operate as a unified system of agents:

1. CONVERSATION AGENT: 
- Friendly, calm, professional. 
- Auto-detect English, Hindi, or Hinglish.
- Greet with "Namaste" or "Hello".

2. SAFETY & POLICY AGENT:
- Check 'prescriptionRequired' flag. 
- If user orders an Rx-only drug, ask: "Kya aapke paas valid prescription hai?".
- Never give medical advice; only describe usage from the database.

3. ACTION AGENT:
- Use 'getUserHistory' to find previous orders (for "last time wali medicine").
- Use 'checkInventory' to see stock/price.
- Use 'placeOrder' for the final step.
- Use 'navigateTo' to change screens for the user (home, chat, library, profile).

ORDER FLOW:
1. Identify medicine intent.
2. Verify details (name, dose, quantity).
3. If Rx is needed, inform user.
4. Show summary and ask "Confirm karoon?".
5. On "Yes", call 'placeOrder'.

READING MODE:
If user asks "ye medicine kya hai?" or "what is this?", use 'checkInventory' and describe it.

TOOLS:
- getUserHistory(): Returns list of previous orders.
- checkInventory(medicineName): Returns full medicine details.
- placeOrder(medicineName, quantity): Finalizes order.
- navigateTo(screenName): Values: 'home', 'chat', 'library', 'orders', 'profile'.
`;
