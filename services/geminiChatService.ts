
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

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

export class GeminiChatService {
  private history: any[] = [];
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async *sendMessageStream(
    message: string,
    onToolCall: (name: string, args: any) => any
  ) {
    // Add user message to local history
    this.history.push({ role: 'user', parts: [{ text: message }] });

    const config = {
      model: 'gemini-3-pro-preview', // Use Pro for smarter reasoning
      contents: this.history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ 
          functionDeclarations: [getUserHistoryTool, checkInventoryTool, placeOrderTool, navigateToTool] 
        }]
      }
    };

    let response = await this.ai.models.generateContent(config);
    
    // Check for tool calls
    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionResponses = [];
      for (const fc of response.functionCalls) {
        const result = await onToolCall(fc.name, fc.args);
        functionResponses.push({
          id: fc.id,
          name: fc.name,
          response: { result }
        });
      }

      // Add tool responses to history
      this.history.push(response.candidates?.[0]?.content);
      this.history.push({ role: 'function', parts: functionResponses.map(fr => ({ functionResponse: fr })) });

      // Get final response after tools
      const stream = await this.ai.models.generateContentStream({
        ...config,
        contents: this.history
      });

      let finalBotText = "";
      for await (const chunk of stream) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
          finalBotText += text;
          yield text;
        }
      }
      this.history.push({ role: 'model', parts: [{ text: finalBotText }] });
    } else {
      // Normal direct response
      const stream = await this.ai.models.generateContentStream(config);
      let finalBotText = "";
      for await (const chunk of stream) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
          finalBotText += text;
          yield text;
        }
      }
      this.history.push({ role: 'model', parts: [{ text: finalBotText }] });
    }
  }

  clearHistory() {
    this.history = [];
  }
}
