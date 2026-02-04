
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { ChatInterface } from './components/ChatInterface';
import { MedicineLibrary } from './components/MedicineLibrary';
import { OrdersView } from './components/OrdersView';
import { AddressPicker } from './components/AddressPicker';
import { SuccessScreen } from './components/SuccessScreen';
import { ProfileView } from './components/ProfileView';
import { ChatMessage, MessageRole, AppScreen, OrderDraft, Medicine } from './types';
import { GeminiLiveController } from './services/geminiLiveService';
import { GeminiChatService } from './services/geminiChatService';
import { MEDICINE_MASTER_DATA, MOCK_USER_HISTORY } from './constants';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('home');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connected' | 'connecting' | 'closed'>('idle');
  
  // Order Flow State
  const [orderDraft, setOrderDraft] = useState<OrderDraft>({
    medicine: null,
    quantity: 1,
    address: {
      fullName: 'Rahul Sharma',
      line1: '21, MG Road, Pune',
      city: 'Pune',
      pincode: '411001'
    }
  });

  const controllerRef = useRef<GeminiLiveController | null>(null);
  const chatServiceRef = useRef<GeminiChatService | null>(null);

  useEffect(() => {
    controllerRef.current = new GeminiLiveController();
    chatServiceRef.current = new GeminiChatService();
    return () => {
      controllerRef.current?.stop();
    };
  }, []);

  const handleNavigate = (screen: AppScreen) => {
    setActiveScreen(screen);
  };

  const handleToolCall = (name: string, args: any) => {
    if (name === 'getUserHistory') return MOCK_USER_HISTORY;
    if (name === 'checkInventory') {
      const med = MEDICINE_MASTER_DATA.find(m => m.name.toLowerCase().includes(args.medicineName.toLowerCase()));
      return med || { error: "Not found" };
    }
    if (name === 'placeOrder') {
      const med = MEDICINE_MASTER_DATA.find(m => m.name.toLowerCase().includes(args.medicineName.toLowerCase()));
      if (med) setOrderDraft(prev => ({ ...prev, medicine: med }));
      return { status: "success" };
    }
    if (name === 'navigateTo') {
      setActiveScreen(args.screenName as AppScreen);
      return { status: "success" };
    }
    return "ok";
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isBotTyping) return;
    
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: MessageRole.USER,
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsBotTyping(true);

    try {
      const botMsgId = Math.random().toString();
      const botMsg: ChatMessage = {
        id: botMsgId,
        role: MessageRole.BOT,
        text: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

      let fullText = '';
      const stream = chatServiceRef.current?.sendMessageStream(text, handleToolCall);
      
      if (stream) {
        for await (const chunk of stream) {
          fullText += chunk;
          setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
        }
      }
    } catch (err) {
      console.error('Chat failed:', err);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleToggleMic = async () => {
    if (isListening) {
      await controllerRef.current?.stop();
      setIsListening(false);
      setStatus('idle');
    } else {
      setStatus('connecting');
      try {
        await controllerRef.current?.connect({
          onMessage: (text, isUser) => {
            setMessages(prev => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg && ((lastMsg.role === MessageRole.USER && isUser) || (lastMsg.role === MessageRole.BOT && !isUser))) {
                return [...prev.slice(0, -1), { ...lastMsg, text }];
              }
              return [...prev, { id: Math.random().toString(), role: isUser ? MessageRole.USER : MessageRole.BOT, text, timestamp: new Date() }];
            });
          },
          onStatusChange: (s) => {
            setStatus(s as any);
            if (s === 'connected') setIsListening(true);
            else if (s === 'closed') setIsListening(false);
          },
          onInterrupted: () => {},
          onNavigate: (screen) => {
            setActiveScreen(screen);
          }
        });
      } catch (err) {
        console.error('Connection failed:', err);
        setStatus('idle');
      }
    }
  };

  const finalizeOrder = () => {
    setActiveScreen('success');
    setOrderDraft(prev => ({ ...prev, medicine: null }));
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <Home onNavigate={handleNavigate} onOrderMedicine={(med) => {
          setOrderDraft(prev => ({ ...prev, medicine: med }));
          setActiveScreen('chat');
        }} />;
      case 'chat':
        return (
          <ChatInterface 
            messages={messages} 
            isListening={isListening} 
            onToggleMic={handleToggleMic}
            onSendMessage={handleSendMessage}
            status={status}
            orderDraft={orderDraft}
            onConfirmOrder={() => finalizeOrder()}
            onChangeAddress={() => setActiveScreen('address')}
            onSelectMedicine={(med) => setOrderDraft(prev => ({ ...prev, medicine: med }))}
          />
        );
      case 'library':
        return <MedicineLibrary />;
      case 'orders':
        return <OrdersView />;
      case 'address':
        return (
          <AddressPicker 
            address={orderDraft.address!} 
            onSave={(newAddr) => {
              setOrderDraft(prev => ({ ...prev, address: newAddr }));
              setActiveScreen('chat');
            }} 
            onCancel={() => setActiveScreen('chat')}
          />
        );
      case 'success':
        return <SuccessScreen onDone={() => setActiveScreen('home')} />;
      case 'profile':
        return <ProfileView />;
      default:
        return <Home onNavigate={handleNavigate} onOrderMedicine={() => {}} />;
    }
  };

  return (
    <Layout activeScreen={activeScreen} onNavigate={handleNavigate}>
      {renderScreen()}
    </Layout>
  );
};

export default App;
