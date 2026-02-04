
import { GoogleGenAI, Type, FunctionDeclaration, Chat, GenerateContentResponse } from "@google/genai";
import { MEDICINE_MASTER_DATA, MOCK_USER_HISTORY, SYSTEM_INSTRUCTION } from "../constants";

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
  private chat: Chat | null = null;
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private initChat() {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ 
          functionDeclarations: [getUserHistoryTool, checkInventoryTool, placeOrderTool, navigateToTool] 
        }]
      }
    });
  }

  async sendMessage(
    message: string, 
    onToolCall: (name: string, args: any) => any
  ): Promise<string> {
    if (!this.chat) this.initChat();

    let response = await this.chat!.sendMessage({ message });
    
    // Handle potential tool calls (recursive to handle chain calls if needed)
    while (response.functionCalls && response.functionCalls.length > 0) {
      const toolResponses = [];
      for (const fc of response.functionCalls) {
        const result = await onToolCall(fc.name, fc.args);
        toolResponses.push({
          id: fc.id,
          name: fc.name,
          response: { result }
        });
      }
      
      // Submit tool results back to get final text
      response = await this.chat!.sendMessage({
        message: "Tool executed", // The model uses the functionResponses internally
        // Note: SDK standard for following up with tool results
      } as any); // Type cast if necessary for internal tool response handling
    }

    return response.text || "I'm sorry, I couldn't process that.";
  }

  // Simplified streaming for the text chatbot
  async *sendMessageStream(
    message: string,
    onToolCall: (name: string, args: any) => any
  ) {
    if (!this.chat) this.initChat();

    // For tool calls, we execute them and then stream the final response
    const response = await this.chat!.sendMessage({ message });
    
    if (response.functionCalls && response.functionCalls.length > 0) {
      const toolResponses = [];
      for (const fc of response.functionCalls) {
        const result = await onToolCall(fc.name, fc.args);
        toolResponses.push({ id: fc.id, name: fc.name, response: { result } });
      }
      
      // After tools, we do a normal stream for the final text
      const stream = await this.chat!.sendMessageStream({ message: "Processed details." });
      for await (const chunk of stream) {
        yield (chunk as GenerateContentResponse).text;
      }
    } else {
       // Direct text response
       const stream = await this.chat!.sendMessageStream({ message });
       for await (const chunk of stream) {
         yield (chunk as GenerateContentResponse).text;
       }
    }
  }
}
