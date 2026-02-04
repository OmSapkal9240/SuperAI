
import { GoogleGenAI, LiveServerMessage, Type, FunctionDeclaration, Modality } from '@google/genai';
import { createPcmBlob, decodeAudioData, decodeBase64 } from './audioUtils';
import { MEDICINE_MASTER_DATA, MOCK_USER_HISTORY, SYSTEM_INSTRUCTION } from '../constants';
import { AppScreen } from '../types';

const getUserHistoryTool: FunctionDeclaration = {
  name: 'getUserHistory',
  description: 'Get the previous medicine orders of the current user.',
  parameters: { type: Type.OBJECT, properties: {} }
};

const checkInventoryTool: FunctionDeclaration = {
  name: 'checkInventory',
  description: 'Check stock levels and price of a specific medicine.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      medicineName: { type: Type.STRING, description: 'Name of the medicine' }
    },
    required: ['medicineName']
  }
};

const placeOrderTool: FunctionDeclaration = {
  name: 'placeOrder',
  description: 'Submit an order for a medicine and update inventory.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      medicineName: { type: Type.STRING },
      quantity: { type: Type.NUMBER }
    },
    required: ['medicineName', 'quantity']
  }
};

const navigateToTool: FunctionDeclaration = {
  name: 'navigateTo',
  description: 'Navigate the user to a specific screen in the app.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      screenName: { 
        type: Type.STRING, 
        description: "The name of the screen. Options: 'home', 'chat', 'library', 'orders', 'profile', 'address', 'success'." 
      }
    },
    required: ['screenName']
  }
};

export class GeminiLiveController {
  private sessionPromise: Promise<any> | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();

  async connect(callbacks: {
    onMessage: (text: string, isUser: boolean) => void;
    onStatusChange: (status: string) => void;
    onInterrupted: () => void;
    onNavigate: (screen: AppScreen) => void;
  }) {
    // Initialize AI strictly inside connect to ensure up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          callbacks.onStatusChange('connected');
          const source = this.inputAudioContext!.createMediaStreamSource(stream);
          const scriptProcessor = this.inputAudioContext!.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createPcmBlob(inputData);
            // CRITICAL: Solely rely on sessionPromise resolves and then call `session.sendRealtimeInput`
            this.sessionPromise?.then(session => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(this.inputAudioContext!.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          // Handle Model Audio Output
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && this.outputAudioContext) {
            this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
            const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), this.outputAudioContext, 24000, 1);
            const source = this.outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.outputAudioContext.destination);
            
            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
            this.sources.add(source);
            source.onended = () => this.sources.delete(source);
          }

          // Simplified Transcription Handling
          if (message.serverContent?.inputTranscription) {
            callbacks.onMessage(message.serverContent.inputTranscription.text, true);
          }
          if (message.serverContent?.outputTranscription) {
            callbacks.onMessage(message.serverContent.outputTranscription.text, false);
          }

          // Handle Interruptions
          if (message.serverContent?.interrupted) {
            this.sources.forEach(s => s.stop());
            this.sources.clear();
            this.nextStartTime = 0;
            callbacks.onInterrupted();
          }

          // Tool Call Logic
          if (message.toolCall) {
            for (const fc of message.toolCall.functionCalls) {
              let result: any = "ok";
              const args = fc.args as any;
              
              if (fc.name === 'getUserHistory') {
                result = MOCK_USER_HISTORY;
              } else if (fc.name === 'checkInventory') {
                const med = MEDICINE_MASTER_DATA.find(m => m.name.toLowerCase().includes(args.medicineName.toLowerCase()));
                result = med || { error: "Medicine not found in local database." };
              } else if (fc.name === 'placeOrder') {
                result = { status: 'success', message: 'Confirmed. Order sent to pharmacist.', details: args };
              } else if (fc.name === 'navigateTo') {
                callbacks.onNavigate(args.screenName as AppScreen);
                result = { status: 'success', message: `Interface updated to ${args.screenName}` };
              }

              // After executing the function call, send the response back to the model
              this.sessionPromise?.then(session => {
                session.sendToolResponse({
                  functionResponses: {
                    id: fc.id,
                    name: fc.name,
                    response: { result }
                  }
                });
              });
            }
          }
        },
        onerror: (e: any) => {
          console.error('Gemini Session Error:', e);
          callbacks.onStatusChange('closed');
        },
        onclose: () => callbacks.onStatusChange('closed')
      },
      config: {
        // Corrected: Use Modality.AUDIO instead of string literal 'AUDIO'
        responseModalities: [Modality.AUDIO],
        speechConfig: { 
          voiceConfig: { 
            // Kore is used as a professional pharmacist voice
            prebuiltVoiceConfig: { voiceName: 'Kore' } 
          } 
        },
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ 
          functionDeclarations: [getUserHistoryTool, checkInventoryTool, placeOrderTool, navigateToTool] 
        }]
      }
    });
  }

  async stop() {
    if (this.sessionPromise) {
      const session = await this.sessionPromise;
      session.close();
      this.sessionPromise = null;
    }
    this.inputAudioContext?.close();
    this.outputAudioContext?.close();
    this.sources.forEach(s => s.stop());
    this.sources.clear();
  }
}
